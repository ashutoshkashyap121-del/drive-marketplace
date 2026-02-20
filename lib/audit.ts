import { prisma } from "@/lib/prisma";

type AuditParams = {
  action: string;
  entityType: string;
  entityId?: string | number;
  metadata?: any;
};

export async function logAdminAction({
  action,
  entityType,
  entityId,
  metadata,
}: AuditParams) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        action,
        entityType,
        entityId: entityId ? String(entityId) : undefined,
        metadata,
      },
    });
  } catch (error) {
    console.error("AUDIT LOG ERROR:", error);
  }
}