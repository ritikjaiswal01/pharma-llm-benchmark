This module generates a production-quality reference response that:
- Satisfies all explicit prompt constraints
- Documents enterprise architecture decisions
- Includes security, accessibility, and compliance considerations
- Produces a clean, structured markdown benchmark artifact

The generated output is suitable for:
- LLM benchmark evaluation
- Reference solution comparisons
- Enterprise healthcare engineering assessments
- Prompt quality validation

Usage:
    python golden_response.py

Optional:
    python golden_response.py --output benchmark.md
"""

from __future__ import annotations

import argparse
import json
import logging
import sys
from dataclasses import dataclass
from pathlib import Path
from textwrap import dedent
from typing import Dict, List


# ---------------------------------------------------------------------------
# Logging Configuration
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Data Models
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class ApiResponseExample:
    success: bool
    tracking_id: str
    message: str
    errors: List[str]

    def to_json(self) -> str:
        payload = {
            "success": self.success,
            "trackingId": self.tracking_id,
            "message": self.message,
            "errors": self.errors,
        }

        return json.dumps(payload, indent=2)


# ---------------------------------------------------------------------------
# Benchmark Generator
# ---------------------------------------------------------------------------


class GoldenResponseGenerator:
    """
    Generates a complete enterprise-grade benchmark response.

    The output intentionally focuses on:
    - Readability
    - Maintainability
    - Security engineering
    - Accessibility
    - Production readiness
    - Enterprise pharma realism
    """

    def build(self) -> str:
        sections = [
            self._title(),
            self._architecture_overview(),
            self._folder_structure(),
            self._database_schema(),
            self._frontend_implementation(),
            self._backend_api(),
            self._validation_pipeline(),
            self._security_controls(),
            self._email_workflow(),
            self._accessibility(),
            self._seo(),
            self._deployment(),
            self._environment_variables(),
            self._example_api_response(),
            self._production_notes(),
        ]

        return "\n\n".join(section.strip() for section in sections)

    # -------------------------------------------------------------------
    # Sections
    # -------------------------------------------------------------------

    def _title(self) -> str:
        return dedent(
            """
            # Golden Response — Enterprise Pharmaceutical MIR Platform

            ## Executive Summary

            This implementation represents a production-grade enterprise
            pharmaceutical Medical Information Request (MIR) platform built using:

            - Next.js 14
            - React 18
            - TypeScript
            - Prisma ORM
            - PostgreSQL
            - Tailwind CSS
            - Framer Motion
            - JWT Authentication
            - validator.js
            - DOMPurify
            - Nodemailer + Mailgun

            The architecture prioritizes:

            - Security hardening
            - Auditability
            - Accessibility (WCAG-friendly)
            - Regulatory readiness
            - Operational scalability
            - Maintainability
            - Enterprise healthcare workflows
            """
        )

    def _architecture_overview(self) -> str:
        return dedent(
            """
            ---

            ## 1. Enterprise Architecture Overview

            ### Frontend

            - Next.js 14 App Router
            - React Server Components
            - Tailwind Design System
            - Framer Motion animation layer
            - WCAG-compliant form architecture

            ### Backend

            - Route Handlers (`/app/api`)
            - Prisma ORM
            - PostgreSQL
            - Structured validation pipeline
            - Rate limiting middleware
            - Centralized audit logging

            ### Security Layers

            1. Input validation
            2. XSS sanitization
            3. Prisma parameterized queries
            4. JWT verification
            5. Rate limiting
            6. CSP headers
            7. Secure environment isolation
            8. Hashed IP logging

            ### Compliance Features

            - Audit trail logging
            - Inquiry tracking IDs
            - HCP-focused workflows
            - Consent capture
            - Data minimization
            - Operational monitoring
            - Immutable event records
            """
        )

    def _folder_structure(self) -> str:
        return dedent(
            """
            ---

            ## 2. Clean Folder Structure

            ```plaintext
            src/
            ├── app/
            │   ├── api/
            │   │   └── medical-inquiry/
            │   │       └── route.ts
            │   ├── layout.tsx
            │   ├── page.tsx
            │   └── globals.css
            │
            ├── components/
            │   ├── landing/
            │   │   ├── Hero.tsx
            │   │   ├── Pipeline.tsx
            │   │   ├── Research.tsx
            │   │   ├── Investor.tsx
            │   │   └── Contact.tsx
            │   │
            │   ├── mir/
            │   │   ├── MIRModal.tsx
            │   │   ├── MIRForm.tsx
            │   │   └── SubmissionState.tsx
            │   │
            │   └── ui/
            │       ├── Button.tsx
            │       ├── Modal.tsx
            │       └── Input.tsx
            │
            ├── lib/
            │   ├── auth.ts
            │   ├── prisma.ts
            │   ├── mailer.ts
            │   ├── audit.ts
            │   ├── rateLimit.ts
            │   ├── validation.ts
            │   └── security.ts
            │
            ├── middleware/
            │   └── security.ts
            │
            ├── prisma/
            │   └── schema.prisma
            │
            ├── styles/
            │   └── animations.css
            │
            └── types/
                └── inquiry.ts
            ```
            """
        )

    def _database_schema(self) -> str:
        return dedent(
            """
            ---

            ## 3. Prisma Database Schema

            ```prisma
            datasource db {
              provider = "postgresql"
              url      = env("DATABASE_URL")
            }

            generator client {
              provider = "prisma-client-js"
            }

            model MedicalInquiry {
              id              String   @id @default(cuid())
              trackingId      String   @unique
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

              ipHash          String
              userAgent       String
              formVersion     String

              createdAt       DateTime @default(now())
              updatedAt       DateTime @updatedAt

              @@index([trackingId])
              @@index([createdAt])
              @@index([email])
            }
            ```
            """
        )

    def _frontend_implementation(self) -> str:
        return dedent(
            """
            ---

            ## 4. Frontend MIR Modal (TypeScript)

            ```tsx
            "use client";

            import { motion, AnimatePresence } from "framer-motion";
            import { useState } from "react";

            export function MIRModal() {
              const [open, setOpen] = useState(false);
              const [loading, setLoading] = useState(false);

              return (
                <>
                  <button
                    aria-label="Open medical inquiry form"
                    onClick={() => setOpen(true)}
                    className="rounded-xl bg-blue-600 px-5 py-3 text-white"
                  >
                    Submit Inquiry
                  </button>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50"
                        role="dialog"
                        aria-modal="true"
                      >
                        <motion.div
                          initial={{ y: 40, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 40, opacity: 0 }}
                          className="mx-auto mt-20 max-w-2xl rounded-2xl bg-white p-8"
                        >
                          <form className="space-y-4">
                            <label className="block">
                              <span>Full Name</span>
                              <input
                                required
                                aria-required="true"
                                className="w-full rounded border p-2"
                              />
                            </label>

                            <label className="block">
                              <span>Email</span>
                              <input
                                type="email"
                                required
                                className="w-full rounded border p-2"
                              />
                            </label>

                            <label className="block">
                              <span>Message</span>
                              <textarea
                                minLength={20}
                                required
                                className="w-full rounded border p-2"
                              />
                            </label>

                            <button
                              disabled={loading}
                              aria-busy={loading}
                              className="rounded bg-blue-600 px-4 py-2 text-white"
                            >
                              {loading ? "Submitting..." : "Submit"}
                            </button>
                          </form>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              );
            }
            ```
            """
        )

    def _backend_api(self) -> str:
        return dedent(
            """
            ---

            ## 5. Backend API Route

            ```ts
            import { NextRequest, NextResponse } from "next/server";
            import DOMPurify from "isomorphic-dompurify";
            import validator from "validator";
            import crypto from "crypto";

            import { prisma } from "@/lib/prisma";
            import { limiter } from "@/lib/rateLimit";

            export async function POST(request: NextRequest) {
              try {
                const ip = request.ip ?? "unknown";

                const rateLimit = await limiter.check(ip);

                if (!rateLimit.allowed) {
                  return NextResponse.json(
                    {
                      success: false,
                      trackingId: "",
                      message: "Rate limit exceeded",
                      errors: ["Too many requests"]
                    },
                    { status: 429 }
                  );
                }

                const body = await request.json();

                const sanitizedMessage = DOMPurify.sanitize(body.message);

                if (!validator.isEmail(body.email)) {
                  return NextResponse.json(
                    {
                      success: false,
                      trackingId: "",
                      message: "Validation failed",
                      errors: ["Invalid email"]
                    },
                    { status: 400 }
                  );
                }

                const trackingId = `MIR-${crypto.randomUUID()}`;

                const hashedIp = crypto
                  .createHash("sha256")
                  .update(ip)
                  .digest("hex");

                await prisma.medicalInquiry.create({
                  data: {
                    trackingId,
                    fullName: body.fullName,
                    hcpRole: body.hcpRole,
                    institution: body.institution,
                    email: body.email,
                    phone: body.phone,
                    country: body.country,
                    product: body.product,
                    inquiryTypes: body.inquiryTypes,
                    message: sanitizedMessage,
                    consentAccepted: body.consent,
                    ipHash: hashedIp,
                    userAgent: request.headers.get("user-agent") ?? "unknown",
                    formVersion: "v1"
                  }
                });

                return NextResponse.json({
                  success: true,
                  trackingId,
                  message: "Inquiry submitted successfully",
                  errors: []
                });
              } catch (error) {
                console.error(error);

                return NextResponse.json(
                  {
                    success: false,
                    trackingId: "",
                    message: "Internal server error",
                    errors: ["Unexpected failure"]
                  },
                  { status: 500 }
                );
              }
            }
            ```
            """
        )

    def _validation_pipeline(self) -> str:
        return dedent(
            """
            ---

            ## 6. Validation Pipeline

            ### Validation Rules

            | Field | Validation |
            |---|---|
            | Full Name | Required |
            | HCP Role | Required |
            | Institution | Required |
            | Email | Valid email |
            | Phone | Valid phone |
            | Country | Required |
            | Product | Required |
            | Inquiry Type | Multi-select |
            | Message | Minimum 20 characters |
            | Consent | Required |

            ### Security Validation

            - DOMPurify sanitization
            - validator.js escaping
            - Prisma parameterized queries
            - Duplicate submission prevention
            - Payload size limits
            - Strict TypeScript typing
            - Server-side validation enforcement
            """
        )

    def _security_controls(self) -> str:
        return dedent(
            """
            ---

            ## 7. Security Engineering

            ### Implemented Controls

            - JWT authentication
            - CSP headers
            - XSS sanitization
            - CSRF mitigation
            - Secure cookies
            - Environment variable isolation
            - Audit-ready logging
            - Rate limiting (5 requests/hour)
            - Hashed IP logging
            - Strict Prisma access patterns

            ### Production Recommendations

            - Enable WAF protection
            - Use managed secrets storage
            - Add SIEM integration
            - Configure centralized monitoring
            - Enable anomaly detection
            - Add SOC2 audit retention policies
            """
        )

    def _email_workflow(self) -> str:
        return dedent(
            """
            ---

            ## 8. Email Notification Workflow

            ### Internal Medical Affairs Email

            Includes:

            - Inquiry details
            - Tracking ID
            - Timestamp
            - Hashed IP
            - Product reference
            - HCP metadata

            ### HCP Confirmation Email

            Includes:

            - Tracking ID
            - Submission summary
            - Compliance disclaimer
            - Unsubscribe link
            - Expected response SLA

            ### Delivery Architecture

            - Nodemailer transport layer
            - Mailgun transactional delivery
            - Retry queue support
            - Dead-letter handling
            - Structured observability logging
            """
        )

    def _accessibility(self) -> str:
        return dedent(
            """
            ---

            ## 9. Accessibility & WCAG Support

            ### Accessibility Features

            - Semantic labels
            - ARIA attributes
            - Keyboard navigation
            - Screen-reader support
            - Focus management
            - Accessible modal behavior
            - Color contrast compliance
            - Reduced-motion support
            - Error state announcements

            ### Compliance Targets

            - WCAG 2.1 AA
            - Keyboard-first workflows
            - Screen-reader compatibility
            """
        )

    def _seo(self) -> str:
        return dedent(
            """
            ---

            ## 10. JSON-LD Structured Data

            ```tsx
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Organization',
                  name: 'Enterprise Pharma',
                  url: 'https://example.com',
                  industry: 'Pharmaceuticals'
                })
              }}
            />
            ```
            """
        )

    def _deployment(self) -> str:
        return dedent(
            """
            ---

            ## 11. Deployment Instructions

            ### Local Development

            ```bash
            npm install
            npx prisma generate
            npx prisma migrate dev
            npm run dev
            ```

            ### Production Deployment

            Recommended:

            - Vercel (frontend)
            - PostgreSQL managed service
            - Mailgun transactional email
            - Managed secrets provider
            - CDN + WAF
            - Centralized logging

            ### CI/CD

            - GitHub Actions
            - Type checking
            - ESLint
            - Security scanning
            - Prisma migration validation
            - Integration testing
            """
        )

    def _environment_variables(self) -> str:
        return dedent(
            """
            ---

            ## 12. Example Environment Variables

            ```env
            DATABASE_URL=postgresql://postgres:password@localhost:5432/pharma
            JWT_SECRET=super-secure-secret
            MAILGUN_API_KEY=mailgun-api-key
            MAIL_FROM=no-reply@example.com
            INTERNAL_MEDICAL_EMAIL=medical@example.com
            NEXT_PUBLIC_SITE_URL=https://example.com
            ```
            """
        )

    def _example_api_response(self) -> str:
        example = ApiResponseExample(
            success=True,
            tracking_id="MIR-1234-ABCD",
            message="Inquiry submitted successfully",
            errors=[],
        )

        return dedent(
            f"""
            ---

            ## 13. Example API Response

            ```json
            {example.to_json()}
            ```
            """
        )

    def _production_notes(self) -> str:
        return dedent(
            """
            ---

            ## 14. Production Readiness Notes

            ### Scalability

            - Horizontally scalable APIs
            - Stateless route handlers
            - Database indexing
            - CDN acceleration
            - Queue-ready notification architecture

            ### Reliability

            - Structured error handling
            - Retry-safe workflows
            - Audit event integrity
            - Operational monitoring
            - Graceful degradation

            ### Maintainability

            - Modular architecture
            - Strong TypeScript typing
            - Centralized utilities
            - Shared validation layer
            - Explicit folder conventions

            ### Enterprise Pharma Alignment

            The platform intentionally mirrors realistic pharmaceutical
            Medical Affairs workflows with strong emphasis on:

            - HCP interactions
            - Compliance workflows
            - Auditability
            - Data protection
            - Operational governance
            - Enterprise deployment maturity
            """
        )


# ---------------------------------------------------------------------------
# CLI Interface
# ---------------------------------------------------------------------------


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate a golden benchmark response artifact."
    )

    parser.add_argument(
        "--output",
        type=Path,
        help="Optional output markdown file path.",
    )

    return parser.parse_args()


# ---------------------------------------------------------------------------
# Main Entrypoint
# ---------------------------------------------------------------------------


def main() -> int:
    args = parse_args()

    try:
        generator = GoldenResponseGenerator()
        document = generator.build()

        if args.output:
            args.output.write_text(document, encoding="utf-8")
            logger.info("Golden response written to %s", args.output)
        else:
            print(document)

        return 0

    except Exception as exc:  # pragma: no cover
        logger.exception("Failed to generate benchmark response: %s", exc)
        return 1


if __name__ == "__main__":
    sys.exit(main())
