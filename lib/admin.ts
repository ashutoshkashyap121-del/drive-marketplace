import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function verifyAdmin(): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("admin_session")?.value;

    if (!sessionId) return false;

    const session = await prisma.adminSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) return false;

    // Check expiry
    if (session.expiresAt < new Date()) {
      // Optional: auto cleanup expired session
      await prisma.adminSession.delete({
        where: { id: sessionId },
      });

      return false;
    }

    return true;

  } catch (error) {
    console.error("VERIFY ADMIN ERROR:", error);
    return false;
  }
}