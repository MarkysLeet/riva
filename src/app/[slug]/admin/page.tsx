import { redirect } from "next/navigation";

export const instant = false;

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  return redirect(`/${resolved.slug}/dashboard`);
}
