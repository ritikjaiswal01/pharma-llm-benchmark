# Enterprise Pharmaceutical Platform — Full-Stack Engineering Benchmark Prompt

## Scenario

You are a senior full-stack healthcare platform engineer working for a multinational pharmaceutical company.

Your task is to design and implement a secure Medical Information Request (MIR) system for healthcare professionals (HCPs) integrated into a pharmaceutical corporate platform.

The system must comply with healthcare compliance requirements, support secure inquiry submissions, and provide audit-ready tracking.

The implementation should simulate production-grade enterprise architecture.

---

# Technical Requirements

## Frontend Stack

- React 18
- Next.js 14
- Tailwind CSS
- Framer Motion

## Backend Stack

- Node.js
- Express.js or Next.js API Routes
- PostgreSQL
- Prisma ORM

## Security & Validation

- validator.js
- DOMPurify
- express-rate-limit
- JWT Authentication

## Notifications

- Nodemailer
- Mailgun

---

# Functional Requirements

Implement the following features:

## 1. Landing Page

Create a pharmaceutical enterprise landing page with:

- Hero section
- Animated statistics
- Pipeline showcase
- Research section
- HCP secure access section
- Investor section
- Contact section

Animations must include:

- Fade-in effects
- Scroll-triggered animations
- Parallax effects
- Number counters
- Smooth transitions

---

## 2. MIR Modal Form

Implement a Medical Information Request modal using Framer Motion.

The form must include:

| Field | Validation |
|---|---|
| Full Name | Required |
| HCP Role | Required |
| Institution | Required |
| Email | Required + valid email |
| Phone | Required + valid phone |
| Country | Required |
| Product | Required |
| Inquiry Type | Multi-select |
| Message | Minimum 20 characters |
| Consent Checkbox | Required |

---

## 3. Backend API

Create:

POST /api/medical-inquiry

Requirements:

- Validate all inputs
- Sanitize against XSS
- Protect against SQL injection
- Generate unique tracking ID
- Store inquiries in PostgreSQL
- Log:
  - timestamp
  - hashed IP
  - user agent
  - inquiry ID
  - form version

---

## 4. Rate Limiting

Implement:

- Maximum 5 requests per IP per hour

---

## 5. Email Notifications

Send:

### Internal Email
To Medical Affairs Team containing:

- Inquiry details
- Tracking ID
- Timestamp
- Hashed IP

### HCP Confirmation Email
Containing:

- Tracking ID
- Submission summary
- Compliance disclaimer
- Unsubscribe link

---

# Explicit Constraints

Your implementation MUST satisfy ALL of the following:

1. Use TypeScript for frontend code.
2. Use Prisma ORM for database access.
3. API responses MUST follow this structure:

```json
{
  "success": true,
  "trackingId": "MIR-XXXX",
  "message": "string",
  "errors": []
}
```

4. All backend validation errors must return HTTP 400.
5. Use environment variables for secrets/configuration.
6. Include proper async/await error handling.
7. Include accessibility support (WCAG-friendly labels and ARIA attributes).
8. Include JSON-LD structured data for SEO.
9. Prevent duplicate form submissions.
10. Include clean folder structure documentation.

---

# Output Requirements

Provide:

1. Folder structure
2. Database schema
3. Backend API implementation
4. Frontend modal implementation
5. Validation logic
6. Security considerations
7. Email workflow
8. Deployment instructions
9. Example environment variables
10. Example API response

---

# Evaluation Criteria

The solution will be evaluated on:

- Correctness
- Security
- Scalability
- Maintainability
- Readability
- Production readiness
- Error handling
- Compliance awareness
- Accessibility
- Architecture quality
