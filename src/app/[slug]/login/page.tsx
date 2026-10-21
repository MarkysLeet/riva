import { redirect } from "next/navigation";

export const instant = false;

export default async function LoginPage() {
  return redirect("/?auth=login");
}
