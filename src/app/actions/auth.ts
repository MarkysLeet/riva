"use server";

import { createClient } from "@/lib/supabase/server";

export type AuthRole = "client" | "master" | "salon";

// 1. Action to initiate OTP
export async function sendOtp(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true, // Allow new user creation
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// 2. Action to verify OTP and handle tenant logic
export async function verifyOtpAndSetupUser(
  email: string,
  token: string,
  role: AuthRole,
  metadata?: {
    name?: string; // used for master/salon name
    teamSize?: string | null;
    specializations?: string[];
    clientInterests?: string[];
  }
) {
  const supabase = await createClient();

  // Verify the OTP token
  const { data: authData, error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (verifyError || !authData.user) {
    return { error: verifyError?.message || "Invalid or expired code" };
  }

  const userId = authData.user.id;
  let finalSlug: string | null = null;

  // If role is master or salon, handle tenant creation logic
  if (role === "master" || role === "salon") {
    // Check if the user already owns a tenant
    const { data: existingOwnership } = await supabase
      .from("tenant_owners")
      .select("tenant_id, tenants(slug)")
      .eq("user_id", userId)
      .single();

    if (existingOwnership) {
      // User already has a tenant, just return the existing slug
      const tenantsData = existingOwnership.tenants;
      if (Array.isArray(tenantsData)) {
          finalSlug = tenantsData[0]?.slug || null;
      } else {
          finalSlug = (tenantsData as { slug: string } | null)?.slug || null;
      }
      return { success: true, slug: finalSlug };
    }

    // Otherwise, create a new tenant
    const name = metadata?.name || "Studio";
    const isSoloMaster = role === "master";

    // Generate base slug
    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (!baseSlug) {
      baseSlug = "studio";
    }

    // Ensure uniqueness
    let slug = baseSlug;
    let isUnique = false;
    let counter = 1;

    while (!isUnique) {
      const { data: existing } = await supabase
        .from("tenants")
        .select("id")
        .eq("slug", slug)
        .single();

      if (!existing) {
        isUnique = true;
      } else {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Insert tenant
    const { data: tenantData, error: tenantError } = await supabase
      .from("tenants")
      .insert([
        {
          slug,
          name,
          is_solo_master: isSoloMaster,
        },
      ])
      .select("id")
      .single();

    if (tenantError || !tenantData) {
      return { error: tenantError?.message || "Error creating business profile" };
    }

    // Link owner to tenant
    const { error: ownerError } = await supabase.from("tenant_owners").insert([
      {
        tenant_id: tenantData.id,
        user_id: userId,
      },
    ]);

    if (ownerError) {
      return { error: ownerError.message || "Error assigning owner" };
    }

    finalSlug = slug;
  } else {
     // User is a client. Update their user metadata if needed.
     if (metadata?.clientInterests && metadata.clientInterests.length > 0) {
        await supabase.auth.updateUser({
           data: { interests: metadata.clientInterests }
        });
     }
  }

  return { success: true, slug: finalSlug };
}
