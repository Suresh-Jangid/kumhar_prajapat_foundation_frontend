import { redirect } from "next/navigation";

export default function GeneralApplicationIndexPage() {
  redirect("/admin/general-application/create");
}
