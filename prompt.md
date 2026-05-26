# Enterprise Pharmaceutical MIR Platform Benchmark Prompt

## Role

You are a senior full-stack engineer working inside a regulated pharmaceutical technology team. You understand modern product engineering, medical affairs workflows, HCP-facing experiences, privacy-aware data handling, audit logging, accessibility, and production deployment.

## Task

Build a complete Medical Information Request (MIR) platform for a pharmaceutical company. The system must let healthcare professionals submit product and medical-science questions through a secure web experience, store each inquiry with audit-ready metadata, notify the right internal team, and send a clear confirmation back to the requester.

## Context

This platform is going to be used by a big pharmaceutical company that works all around the world. It's not just a simple contact form, but a serious tool that will be used in a setting where many rules and regulations apply. Lots of different teams will be interested in how the platform handles data, including teams that deal with medical issues, drug safety, legal matters, privacy, and reviews from different regions. These teams will want to know how the data is collected, checked for accuracy, stored, sent to the right people, and explained to the users. The platform has to be careful about how it handles all this data to make sure it meets all the necessary standards and rules.

The implementation should feel like a real enterprise engineering deliverable: practical enough to run locally, structured enough for a team to maintain, and careful enough for a regulated healthcare setting.

## Input

Unless a specific requirement states otherwise, we will be using the following technology options.

- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion
- Backend: Next.js API Route Handlers or Node.js route handlers
- Database: PostgreSQL with Prisma ORM
- Validation and sanitization: validator.js, DOMPurify, typed validation helpers
- Authentication and protection: JWT, rate limiting, secure environment variables
- Email: Nodemailer plus Mailgun-ready transport configuration

The MIR form must collect:

- Full name
- HCP role
- Institution
- Email address
- Phone number
- Country
- Product
- Inquiry type, allowing multiple values
- Message, with at least 20 meaningful characters
- Consent confirmation

## Output Format

Return a complete project answer with these sections in this order:

1. Folder structure
2. Setup commands
3. Prisma database schema
4. Shared validation and sanitization logic
5. Backend API implementation for `POST /api/medical-inquiry`
6. Rate limiting and audit logging implementation
7. Email notification workflow
8. Frontend landing page and MIR modal implementation
9. Accessibility and SEO details
10. Security and compliance notes
11. Example environment variables
12. Example successful and failed API responses
13. Deployment instructions
14. Testing checklist

When code is required, provide complete file-level code blocks with the filename clearly shown above each block. Do not provide vague pseudocode for core application behavior.

## Constraints

- Use TypeScript for frontend and route code.
- Use Prisma ORM for all database access.
- Store MIR submissions in PostgreSQL.
- Generate unique tracking IDs using the format `MIR-YYYYMMDD-XXXXXX`.
- Rate limit submissions to 5 requests per hashed IP per hour.
- Sanitize free-text fields against XSS before persistence and email rendering.
- Validate email, phone, required fields, inquiry type values, consent, and minimum message length.
- Return HTTP 400 for validation failures.
- Return API responses using this exact shape:

```json
{
"success": true,
"trackingId": "MIR-20260526-A1B2C3",
"message": "Inquiry submitted successfully.",
"errors": []
}
```

- Use environment variables for secrets, database URLs, Mailgun credentials, JWT secrets, and public site URLs.
- Include proper `try/catch` handling and avoid leaking internal error details to the client.
- Include WCAG-friendly labels, keyboard support, focus management, ARIA attributes, and visible error states.
- Include JSON-LD structured data for the pharmaceutical organization and contact action.
- Prevent duplicate form submissions while a request is in flight.
- Keep the code modular enough that a real team could extend it later.

## Quality Expectations

The answer should read like it came from an experienced engineer explaining a serious build to another engineer. Be clear, calm, specific, and implementation-oriented. The language should be human and direct: no inflated marketing claims, no generic filler, and no unexplained compliance buzzwords.

The final solution will be judged on:

- Correctness and completeness
- Security engineering depth
- Regulatory and medical-affairs realism
- Accessibility quality
- Maintainable architecture
- Backend reliability and error handling
- Database design
- Frontend usability
- Production readiness
- Clarity of setup and deployment instructions