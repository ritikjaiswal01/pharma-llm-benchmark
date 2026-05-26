import nodemailer from "nodemailer";
import type { MedicalInquiry } from "@prisma/client";

const transport = nodemailer.createTransport({
  host: process.env.MAILGUN_SMTP_HOST,
  port: Number(process.env.MAILGUN_SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.MAILGUN_SMTP_USER,
    pass: process.env.MAILGUN_SMTP_PASS,
  },
});

export async function sendMirNotifications(inquiry: MedicalInquiry, hashedIp: string): Promise<void> {
  const from = process.env.MAIL_FROM;
  const internalTo = process.env.INTERNAL_MEDICAL_EMAIL;
  if (!from || !internalTo) throw new Error("Email configuration is incomplete");

  await Promise.all([
    transport.sendMail({
      from,
      to: internalTo,
      subject: `New MIR ${inquiry.trackingId} - ${inquiry.product}`,
      text: [
        `Tracking ID: ${inquiry.trackingId}`,
        `Submitted: ${inquiry.submittedAt.toISOString()}`,
        `Requester: ${inquiry.fullName} (${inquiry.hcpRole})`,
        `Institution: ${inquiry.institution}`,
        `Country: ${inquiry.country}`,
        `Product: ${inquiry.product}`,
        `Inquiry types: ${inquiry.inquiryTypes.join(", ")}`,
        `Hashed IP: ${hashedIp}`,
        "",
        inquiry.message,
      ].join("\n"),
    }),
    transport.sendMail({
      from,
      to: inquiry.email,
      subject: `We received your medical information request ${inquiry.trackingId}`,
      text: [
        `Thank you, ${inquiry.fullName}.`,
        "",
        `Your tracking ID is ${inquiry.trackingId}.`,
        `Product: ${inquiry.product}`,
        `Inquiry type: ${inquiry.inquiryTypes.join(", ")}`,
        "",
        "This confirmation does not contain medical advice. A medical affairs representative will review the request according to local requirements.",
        "If you did not submit this request, please contact privacy@example-pharma.com.",
      ].join("\n"),
    }),
  ]);
}
