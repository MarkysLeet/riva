"use server";

import { createClient } from "@/lib/supabase/server";

export type RegistrationData = {
  type: "salon" | "solo";
  email: string;
  password: string;
  name: string;
  phone: string;
  socials?: { url: string }[];
};

export async function registerTenant(data: RegistrationData) {
  const supabase = await createClient();

  const { email, password, name, type, phone, socials } = data;
  const isSoloMaster = type === "solo";

  // Generate a basic slug from the name
  let baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  if (!baseSlug) {
      baseSlug = "studio";
  }

  // Very basic uniqueness check for slug
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

  // 1. Sign up the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: authError?.message || "Ошибка создания пользователя" };
  }

  const userId = authData.user.id;

  // 2. Insert into tenants table
  const { data: tenantData, error: tenantError } = await supabase
    .from("tenants")
    .insert([
      {
        slug: slug,
        name: name,
        phone: phone,
        social_networks: socials?.map((s) => s.url).filter(Boolean) || [],
        is_solo_master: isSoloMaster,
      },
    ])
    .select("id")
    .single();

  if (tenantError || !tenantData) {
    return { error: tenantError?.message || "Ошибка создания салона/мастера" };
  }

  // 3. Link owner to tenant
  const { error: ownerError } = await supabase.from("tenant_owners").insert([
    {
      tenant_id: tenantData.id,
      user_id: userId,
    },
  ]);

  if (ownerError) {
    return { error: ownerError.message || "Ошибка назначения владельца" };
  }

  return { success: true, tenantId: tenantData.id, slug };
}
