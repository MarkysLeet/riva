import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export const instant = false;

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ message: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const resolvedSearchParams = await searchParams;
  const message = resolvedSearchParams.message;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect(`/${slug}/admin`);
  }

  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: true,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=/${slug}/admin`,
      },
    });

    if (error) {
      return redirect(`/${slug}/login?message=Could not authenticate user`);
    }

    return redirect(`/${slug}/login?message=Check email to continue sign in process`);
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto pt-20">
      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Войти в панель управления
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Вход по волшебной ссылке (Magic Link)
        </p>
      </div>

      <form
        className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground"
        action={signIn}
      >
        <div className="flex flex-col gap-2">
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </div>
        <Button className="w-full">
          Отправить ссылку
        </Button>
        {message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center rounded-md">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
