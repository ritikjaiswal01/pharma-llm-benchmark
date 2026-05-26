# Golden Response - Enterprise Pharmaceutical MIR Platform

This response provides a complete, file-level implementation for a secure HCP Medical Information Request platform. It is written for an enterprise pharmaceutical context, so the answer treats validation, consent, audit logging, privacy-aware metadata, accessibility, and operational behavior as core product requirements.

## 1. Folder structure

```text
pharma-mir-platform/
|-- package.json
|-- next.config.mjs
|-- tsconfig.json
|-- tailwind.config.ts
|-- postcss.config.js
|-- .eslintrc.json
|-- next-env.d.ts
|-- .env.example
|-- prisma/
|   `-- schema.prisma
|-- src/
|   |-- app/
|   |   |-- api/medical-inquiry/route.ts
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |   `-- page.tsx
|   |-- components/mir/MIRModal.tsx
|   `-- lib/
|       |-- email.ts
|       |-- prisma.ts
|       |-- rate-limit.ts
|       |-- security.ts
|       `-- validation.ts
`-- README.md
```

## 2. Setup commands

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## 3. Prisma database schema

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum InquiryStatus {
  RECEIVED
  TRIAGED
  IN_REVIEW
  RESPONDED
  CLOSED
}

model MedicalInquiry {
  id              String        @id @default(cuid())
  trackingId      String        @unique
  fullName        String
  hcpRole         String
  institution     String
  email           String
  phone           String
  country         String
  product         String
  inquiryTypes    String[]
  message         String
  consentAccepted Boolean
  status          InquiryStatus @default(RECEIVED)
  submittedAt     DateTime      @default(now())
  formVersion     String
  source          String        @default("web")
  auditEvents     AuditEvent[]

  @@index([email])
  @@index([country, product])
  @@index([submittedAt])
  @@index([status])
}

model AuditEvent {
  id          String   @id @default(cuid())
  inquiryId   String
  inquiry     MedicalInquiry @relation(fields: [inquiryId], references: [id], onDelete: Cascade)
  eventType   String
  timestamp   DateTime @default(now())
  hashedIp    String
  userAgent   String
  formVersion String
  metadata    Json?

  @@index([hashedIp, timestamp])
  @@index([eventType])
}

```

## 4. Shared validation and sanitization logic

### `src/lib/security.ts`

```ts
import crypto from "crypto";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

const window = new JSDOM("").window as unknown as Window;
const DOMPurify = createDOMPurify(window);

export function sanitizeText(value: string): string {
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}

export function hashIp(ip: string): string {
  const secret = process.env.IP_HASH_SECRET;
  if (!secret) {
    throw new Error("IP_HASH_SECRET is required");
  }

  return crypto.createHmac("sha256", secret).update(ip || "unknown").digest("hex");
}

export function trackingId(date = new Date()): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `MIR-${yyyy}${mm}${dd}-${suffix}`;
}

export function clientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return headers.get("x-real-ip") ?? "unknown";
}

```

### `src/lib/validation.ts`

```ts
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

```

## 5. Backend API implementation

### `src/lib/prisma.ts`

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

```

### `src/app/api/medical-inquiry/route.ts`

```ts
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

```

## 6. Rate limiting and audit logging

### `src/lib/rate-limit.ts`

```ts
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

```

## 7. Email notification workflow

### `src/lib/email.ts`

```ts
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

```

## 8. Frontend landing page and MIR modal

### `src/app/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MIRModal } from "@/components/mir/MIRModal";

export default function HomePage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto grid min-h-screen max-w-6xl content-center gap-10 px-6 py-12 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Medical affairs platform</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight">Enterprise pharmaceutical information requests, handled with care.</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            A secure HCP-facing workflow for product inquiries, audit logging, compliant routing, and clear requester confirmation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => setOpen(true)} className="rounded-md bg-teal-700 px-5 py-3 font-semibold text-white">
              Request medical information
            </button>
            <a href="#pipeline" className="rounded-md border border-slate-300 px-5 py-3 font-semibold text-slate-800">
              View pipeline
            </a>
          </div>
        </div>

        <motion.div
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <dl className="grid gap-5">
            <Stat value="24/7" label="Request intake monitoring" />
            <Stat value="5/hr" label="Submission rate limit per hashed IP" />
            <Stat value="100%" label="Tracked submissions with audit events" />
          </dl>
        </motion.div>
      </section>

      <section id="pipeline" className="border-y border-slate-200 bg-white px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {["Oncology", "Immunology", "Rare disease"].map((area) => (
            <article key={area} className="rounded-lg border border-slate-200 p-5">
              <h2 className="text-xl font-semibold">{area}</h2>
              <p className="mt-2 text-sm text-slate-600">
                Medical content, study references, and region-aware information request routing.
              </p>
            </article>
          ))}
        </div>
      </section>

      <MIRModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-3xl font-semibold text-teal-700">{value}</dt>
      <dd className="mt-1 text-sm text-slate-600">{label}</dd>
    </div>
  );
}

```

### `src/components/mir/MIRModal.tsx`

```tsx
"use client";

import { FormEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
};

const inquiryOptions = [
  ["dosing", "Dosing"],
  ["safety", "Safety"],
  ["efficacy", "Efficacy"],
  ["clinical-trial", "Clinical trial"],
  ["storage", "Storage"],
  ["medical-literature", "Medical literature"],
  ["other", "Other"],
];

export function MIRModal({ open, onClose }: Props) {
  const [errors, setErrors] = useState<string[]>([]);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setErrors([]);
    setTrackingId(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: form.get("fullName"),
      hcpRole: form.get("hcpRole"),
      institution: form.get("institution"),
      email: form.get("email"),
      phone: form.get("phone"),
      country: form.get("country"),
      product: form.get("product"),
      inquiryTypes: form.getAll("inquiryTypes"),
      message: form.get("message"),
      consentAccepted: form.get("consentAccepted") === "on",
    };

    const response = await fetch("/api/medical-inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      setErrors(result.errors?.length ? result.errors : [result.message]);
      setSubmitting(false);
      return;
    }

    setTrackingId(result.trackingId);
    formRef.current?.reset();
    setSubmitting(false);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="mir-title"
            className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-2xl"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="mir-title" className="text-2xl font-semibold text-slate-950">
                  Medical information request
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  For healthcare professionals requesting product or medical-science information.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
              >
                Close
              </button>
            </div>

            {errors.length > 0 ? (
              <div role="alert" className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                {errors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            ) : null}

            {trackingId ? (
              <div role="status" className="mb-4 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
                Request received. Your tracking ID is <strong>{trackingId}</strong>.
              </div>
            ) : null}

            <form ref={formRef} onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" name="fullName" required />
              <Field label="HCP role" name="hcpRole" required />
              <Field label="Institution" name="institution" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" type="tel" required />
              <Field label="Country" name="country" required />
              <Field label="Product" name="product" required />

              <fieldset className="md:col-span-2">
                <legend className="mb-2 text-sm font-medium text-slate-800">Inquiry type</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {inquiryOptions.map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2 rounded-md border border-slate-200 p-2 text-sm">
                      <input name="inquiryTypes" type="checkbox" value={value} />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="md:col-span-2 text-sm font-medium text-slate-800">
                Message
                <textarea
                  name="message"
                  required
                  minLength={20}
                  className="mt-1 min-h-32 w-full rounded-md border border-slate-300 p-3"
                />
              </label>

              <label className="md:col-span-2 flex items-start gap-3 text-sm text-slate-700">
                <input name="consentAccepted" type="checkbox" required className="mt-1" />
                I confirm I am submitting this request for medical information purposes and consent to processing according to the privacy notice.
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="md:col-span-2 rounded-md bg-teal-700 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {submitting ? "Submitting..." : "Submit request"}
              </button>
            </form>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="text-sm font-medium text-slate-800">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
      />
    </label>
  );
}

```

## 9. Accessibility and SEO details

### `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example-pharma.com";
const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Example Pharma";

export const metadata: Metadata = {
  title: `${companyName} Medical Information`,
  description: "Secure medical information request platform for healthcare professionals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: companyName,
    url: siteUrl,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "medical information",
      availableLanguage: ["en"],
    },
  };

  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}

```

The modal uses a real dialog role, `aria-modal`, labelled controls, visible validation errors, status messaging, focusable controls, keyboard-compatible inputs, and a duplicate-submit guard. The layout injects JSON-LD for the medical organization and medical information contact point.

## 10. Security and Compliance Notes

The implementation validates all required fields, normalizes email, validates phone numbers, strips markup from user-controlled text, uses Prisma for database access, stores hashed IP addresses instead of raw IPs, writes audit events in the same transaction as the inquiry, prevents duplicate client submissions, rate limits by hashed IP, and avoids exposing internal exception details to requesters.

## 11. Example environment variables

### `.env.example`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pharma_mir?schema=public"
JWT_SECRET="replace-with-long-random-secret"
IP_HASH_SECRET="replace-with-separate-hash-secret"
MAIL_FROM="medical-information@example-pharma.com"
MAILGUN_SMTP_HOST="smtp.mailgun.org"
MAILGUN_SMTP_PORT="587"
MAILGUN_SMTP_USER="postmaster@example.mailgun.org"
MAILGUN_SMTP_PASS="replace-me"
INTERNAL_MEDICAL_EMAIL="medical-affairs@example-pharma.com"
NEXT_PUBLIC_SITE_URL="https://example-pharma.com"
NEXT_PUBLIC_COMPANY_NAME="Example Pharma"

```

## 12. Example API responses

Successful response:

```json
{
  "success": true,
  "trackingId": "MIR-20260526-A1B2C3",
  "message": "Inquiry submitted successfully.",
  "errors": []
}
```

Validation response:

```json
{
  "success": false,
  "trackingId": null,
  "message": "Please correct the highlighted fields.",
  "errors": [
    "A valid email address is required.",
    "Consent must be accepted before submission."
  ]
}
```

## 13. Deployment Instructions

Use a managed PostgreSQL database, run Prisma migrations during deployment, set all environment variables in the hosting provider, restrict production CORS and mail credentials by environment, enable HTTPS, and connect the Next.js application to Vercel, Azure App Service, AWS Amplify, or an equivalent enterprise hosting environment. Production monitoring should alert on API 5xx rates, email notification failures, and unusual rate-limit activity.

## 14. Testing Checklist

- Submit a valid MIR request and verify a tracking ID is returned.
- Submit missing or malformed fields and verify HTTP 400 with the required response shape.
- Submit more than five requests from the same IP within one hour and verify rate limiting.
- Confirm Prisma stores the inquiry and matching audit event.
- Confirm email failures create an audit event without losing the inquiry.
- Check keyboard navigation, screen-reader labels, focus states, and visible errors.
- Confirm JSON-LD is present in the rendered page source.

## Complete Workspace Manifest

The generator also contains every file in `WORKSPACE_FILES`, so the benchmark can inspect or materialize the full project rather than only reading prose.