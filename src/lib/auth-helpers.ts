/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function setupNewUser(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
  if (!user) return null;

  const metadata = user.user_metadata || {};
  const role = (metadata.role as 'client' | 'master' | 'salon') || 'salon';

  if (role === 'client') {
    return { success: true, role };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let db: any;
  if (supabaseUrl && serviceRoleKey) {
    db = createSupabaseClient(supabaseUrl, serviceRoleKey);
  } else {
    db = await createServerClient();
  }

  // Check if tenant_owner already exists for this user to avoid duplicate setup
  const { data: existingOwner } = await db
    .from("tenant_owners")
    .select("tenant_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existingOwner?.tenant_id) {
    const { data: existingTenant } = await db
      .from("tenants")
      .select("slug")
      .eq("id", existingOwner.tenant_id)
      .maybeSingle();

    if (existingTenant?.slug) {
      return { success: true, role, slug: existingTenant.slug };
    }
  }

  const name =
    (metadata.name as string) ||
    (user.email ? user.email.split("@")[0] : "Новый пользователь");
  const isSoloMaster = role === "master";

  let baseSlug = (metadata.slug as string) || (user.email ? user.email.split("@")[0].split("+")[0] : "studio");
  baseSlug =
    baseSlug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "studio";

  let slug = baseSlug;
  let isUnique = false;
  let counter = 1;

  while (!isUnique) {
    const { data: existing } = await db
      .from("tenants")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!existing) {
      isUnique = true;
    } else {
      slug = `${baseSlug}-${counter++}`;
    }
  }

  const phone = (metadata.phone as string) || null;

  const { data: tenantData, error: tenantError } = await db
    .from("tenants")
    .insert([
      {
        slug: slug,
        name: name,
        phone: phone,
        type: isSoloMaster ? "solo" : "salon",
        is_solo_master: isSoloMaster,
        owner_id: user.id,
        status: "published",
      },
    ])
    .select("id, slug")
    .single();

  if (tenantError || !tenantData) {
    return { error: tenantError?.message || "Ошибка создания профиля" };
  }

  await db.from("tenant_owners").insert([
    {
      tenant_id: tenantData.id,
      user_id: user.id,
      role: "owner",
    },
  ]);

  await db.from("masters").insert([
    {
      tenant_id: tenantData.id,
      user_id: user.id,
      name: name,
      role: "owner",
      status: "active",
    },
  ]);

  await db.from("business_masters").insert([
    {
      business_id: tenantData.id,
      user_id: user.id,
      name: name,
      role: "owner",
      status: "active",
    },
  ]);

  return { success: true, role, slug: tenantData.slug };
}
