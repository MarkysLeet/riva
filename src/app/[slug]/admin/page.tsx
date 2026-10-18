import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const instant = false;

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/${slug}/login`);
  }

  // TODO: Check if user has access to this tenant (slug)

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center pt-20">
      <div className="w-full max-w-4xl flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Панель управления салоном: {slug}
        </h1>
        <p className="text-muted-foreground">
          Добро пожаловать в админку. Здесь будет CRM и управление расписанием.
        </p>

        <div className="p-4 border rounded-lg bg-card text-card-foreground">
           <h2 className="text-xl font-medium mb-4">Данные профиля</h2>
           <pre className="text-xs overflow-auto">
             {JSON.stringify(user, null, 2)}
           </pre>
        </div>

      </div>
    </div>
  );
}
