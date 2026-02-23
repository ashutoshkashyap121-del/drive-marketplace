import { cookies } from "next/headers";

export async function verifyCSRF(req: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const csrfCookie = cookieStore.get("csrf_token")?.value;

  const headerToken = req.headers.get("x-csrf-token");

  if (!csrfCookie || !headerToken) return false;

  return csrfCookie === headerToken;
}