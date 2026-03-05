import { redirect } from "next/navigation";

// Old /book route — redirects to trainer search
export default function OldBookPage() {
  redirect("/trainers");
}