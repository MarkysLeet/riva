import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function setupNewUser(user: { id: string; user_metadata?: Record<string, unknown> }) {
  if (!user || !user.user_metadata) return null;

  const metadata = user.user_metadata;
  const role = metadata.role as 'client' | 'master' | 'salon';

  if (role !== 'master' && role !== 'salon') {
      return { success: true, role };
  }

  // Use service role key to bypass RLS for inserting tenant data
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
      return { error: "Server configuration error" };
  }

  const supabaseAdmin = createSupabaseClient(supabaseUrl, serviceRoleKey);

  // Check if tenant_owner already exists for this user to avoid duplicate setup
  const { data: existingOwner } = await supabaseAdmin
    .from("tenant_owners")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (existingOwner) {
    // Return existing slug
    const { data: existingTenant } = await supabaseAdmin
        .from("tenants")
        .select("slug")
        .eq("id", existingOwner.tenant_id)
        .single();

    return { success: true, role, slug: existingTenant?.slug };
  }

  const name = (metadata.name as string) || "Новый пользователь";
  const isSoloMaster = role === "master";

  let baseSlug = metadata.slug as string;
  if (!baseSlug) {
      baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      if (!baseSlug) baseSlug = "studio";
  }

  let slug = baseSlug;
  let isUnique = false;
  let counter = 1;

  while (!isUnique) {
    const { data: existing } = await supabaseAdmin
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

  const phone = (metadata.phone as string) || null;

  const { data: tenantData, error: tenantError } = await supabaseAdmin
    .from("tenants")
    .insert([
      {
        slug: slug,
        name: name,
        phone: phone,
        is_solo_master: isSoloMaster,
      },
    ])
    .select("id")
    .single();

  if (tenantError || !tenantData) {
    return { error: tenantError?.message || "Ошибка создания профиля" };
  }

  const { error: ownerError } = await supabaseAdmin.from("tenant_owners").insert([
    {
      tenant_id: tenantData.id,
      user_id: user.id,
    },
  ]);

  if (ownerError) {
    return { error: ownerError.message || "Ошибка назначения владельца" };
  }

  if (role === 'master') {
      const { error: masterError } = await supabaseAdmin.from("masters").insert([
          {
              tenant_id: tenantData.id,
              name: name,
          }
      ]);
      if (masterError) {
          console.error("Master insert error:", masterError);
      }
  }

  return { success: true, role, slug };
}
