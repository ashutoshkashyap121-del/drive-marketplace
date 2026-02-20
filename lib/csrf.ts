import { cookies } from "next/headers";

export function verifyCSRF(req: Request): boolean {
  const cookieStore = cookies();
  const csrfCookie = cookieStore.get("csrf_token")?.value;

  const headerToken = req.headers.get("x-csrf-token");

  if (!csrfCookie || !headerToken) return false;

  return csrfCookie === headerToken;
}