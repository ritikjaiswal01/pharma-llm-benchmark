import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientIpFromHeaders, hashIp, trackingId } from "@/lib/security";
import { validateMirPayload, FORM_VERSION } from "@/lib/validation";
import { assertWithinMirRateLimit } from "@/lib/rate-limit";
import { sendMirNotifications } from "@/lib/email";

type ApiShape = {
  success: boolean;
  trackingId: string | null;
  message: string;
  errors: string[];
};

function json(status: number, body: ApiShape) {
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  let hashedIp = "unavailable";

  try {
    const raw = await request.json();
    const validation = validateMirPayload(raw);
    if (!validation.ok) {
      return json(400, {
        success: false,
        trackingId: null,
        message: "Please correct the highlighted fields.",
        errors: validation.errors,
      });
    }

    hashedIp = hashIp(clientIpFromHeaders(request.headers));
    const allowed = await assertWithinMirRateLimit(hashedIp);
    if (!allowed) {
      return json(429, {
        success: false,
        trackingId: null,
        message: "Too many medical inquiry submissions. Please try again later.",
        errors: ["Rate limit exceeded."],
      });
    }

    const id = trackingId();
    const userAgent = request.headers.get("user-agent") ?? "unknown";

    const inquiry = await prisma.$transaction(async (tx) => {
      const record = await tx.medicalInquiry.create({
        data: {
          ...validation.value,
          trackingId: id,
          formVersion: FORM_VERSION,
          auditEvents: {
            create: {
              eventType: "MIR_SUBMITTED",
              hashedIp,
              userAgent,
              formVersion: FORM_VERSION,
              metadata: { source: "public-site", status: "RECEIVED" },
            },
          },
        },
      });

      return record;
    });

    try {
      await sendMirNotifications(inquiry, hashedIp);
    } catch (mailError) {
      await prisma.auditEvent.create({
        data: {
          inquiryId: inquiry.id,
          eventType: "MIR_EMAIL_NOTIFICATION_FAILED",
          hashedIp,
          userAgent,
          formVersion: FORM_VERSION,
          metadata: { reason: mailError instanceof Error ? mailError.message : "unknown" },
        },
      });
    }

    return json(200, {
      success: true,
      trackingId: inquiry.trackingId,
      message: "Inquiry submitted successfully.",
      errors: [],
    });
  } catch {
    return json(500, {
      success: false,
      trackingId: null,
      message: "We could not process the inquiry right now.",
      errors: ["Internal server error."],
    });
  }
}
