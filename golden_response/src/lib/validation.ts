import validator from "validator";
import { sanitizeText } from "./security";

export const FORM_VERSION = "mir-web-v1.0";

const allowedInquiryTypes = new Set([
  "dosing",
  "safety",
  "efficacy",
  "clinical-trial",
  "storage",
  "medical-literature",
  "other",
]);

export type MirPayload = {
  fullName: string;
  hcpRole: string;
  institution: string;
  email: string;
  phone: string;
  country: string;
  product: string;
  inquiryTypes: string[];
  message: string;
  consentAccepted: boolean;
};

export type ValidationResult =
  | { ok: true; value: MirPayload }
  | { ok: false; errors: string[] };

function required(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateMirPayload(input: unknown): ValidationResult {
  const source = input as Partial<MirPayload>;
  const errors: string[] = [];

  const fullName = required(source.fullName) ? sanitizeText(source.fullName) : "";
  const hcpRole = required(source.hcpRole) ? sanitizeText(source.hcpRole) : "";
  const institution = required(source.institution) ? sanitizeText(source.institution) : "";
  const email = required(source.email) ? validator.normalizeEmail(source.email) || "" : "";
  const phone = required(source.phone) ? sanitizeText(source.phone) : "";
  const country = required(source.country) ? sanitizeText(source.country) : "";
  const product = required(source.product) ? sanitizeText(source.product) : "";
  const message = required(source.message) ? sanitizeText(source.message) : "";
  const inquiryTypes = Array.isArray(source.inquiryTypes)
    ? source.inquiryTypes.map((item) => sanitizeText(String(item)))
    : [];

  if (!fullName) errors.push("Full name is required.");
  if (!hcpRole) errors.push("HCP role is required.");
  if (!institution) errors.push("Institution is required.");
  if (!email || !validator.isEmail(email)) errors.push("A valid email address is required.");
  if (!phone || !validator.isMobilePhone(phone, "any", { strictMode: false })) {
    errors.push("A valid phone number is required.");
  }
  if (!country) errors.push("Country is required.");
  if (!product) errors.push("Product is required.");
  if (inquiryTypes.length === 0) errors.push("Select at least one inquiry type.");
  if (inquiryTypes.some((type) => !allowedInquiryTypes.has(type))) {
    errors.push("One or more inquiry types are not supported.");
  }
  if (message.length < 20) errors.push("Message must contain at least 20 characters.");
  if (source.consentAccepted !== true) errors.push("Consent must be accepted before submission.");

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      fullName,
      hcpRole,
      institution,
      email,
      phone,
      country,
      product,
      inquiryTypes,
      message,
      consentAccepted: true,
    },
  };
}
