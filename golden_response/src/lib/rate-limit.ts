import { prisma } from "./prisma";

export async function assertWithinMirRateLimit(hashedIp: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await prisma.auditEvent.count({
    where: {
      hashedIp,
      eventType: "MIR_SUBMITTED",
      timestamp: { gte: oneHourAgo },
    },
  });

  return recentCount < 5;
}
