# Enterprise Pharmaceutical Medical Information Request (MIR) Platform Benchmark Prompt

# Role

As a senior full-stack engineer at a pharmaceutical technology organization, you are responsible for developing secure, scalable, production-grade healthcare applications that comply with enterprise operational and regulatory requirements.

A senior full-stack engineer is responsible for architecting, implementing, testing, securing, deploying, and maintaining both frontend and backend systems in production environments. This includes frontend engineering, backend engineering, backend API development, database architecture, frontend testing, observability, deployment automation, infrastructure-aware engineering, and long-term maintainability.

A regulated pharmaceutical environment is a software ecosystem where systems may be reviewed by:

- Medical affairs teams
- Pharmacovigilance experts
- Privacy officers
- Legal and compliance teams
- Security engineers
- Internal auditors
- Regional governance stakeholders

Applications developed within regulated pharmaceutical environments require:

- Auditability
- Traceability
- Secure data handling
- Accessibility
- Reliability
- Maintainability
- Operational transparency

You are expected to understand:

- Enterprise frontend architecture
- Backend reliability engineering
- Healthcare communication workflows
- Pharmacovigilance-aware intake systems
- Accessibility engineering
- Privacy-aware data handling
- Observability
- Structured audit logging
- Production deployment
- Scalability planning
- Maintainable modular architecture

Building a proof-of-concept demo should not be the primary objective. The goal is to produce an enterprise-scale healthcare communication platform that reflects realistic production engineering practices used within global pharmaceutical organizations.

---

# Primary Objective

Develop a complete Medical Information Request (MIR) platform for a pharmaceutical company.

A Medical Information Request platform is a structured healthcare communication system that allows healthcare professionals to submit:

- Scientific questions
- Clinical questions
- Medical inquiries
- Product-related requests

Examples include:

- Dosage and administration questions
- Clinical trial inquiries
- Literature requests
- Product safety concerns
- Adverse event indicators
- Product complaints
- Medical science communication workflows

The application must provide a secure and accessible web-based experience that allows healthcare professionals to submit inquiries while ensuring:

- Validation
- Sanitization
- Database persistence
- Notification routing
- Audit logging
- Operational traceability

The implementation should resemble a realistic enterprise engineering deliverable suitable for architecture reviews and long-term operational ownership.

---

# Business Context

This platform is not a generic contact form. It is a regulated healthcare intake system that may eventually process safety-sensitive medical communications.

A healthcare professional (HCP) is a medically qualified individual such as:

- Physician
- Pharmacist
- Nurse
- Clinician
- Research scientist
- Healthcare specialist

Medical affairs workflows are operational pharmaceutical processes used to:

- Intake scientific communications
- Classify requests
- Route inquiries
- Investigate cases
- Generate responses
- Archive communications

Pharmacovigilance is the process of monitoring, detecting, evaluating, and escalating potential drug safety issues and adverse events.

Some MIR submissions may later require escalation into specialized safety workflows. Because of this, the platform must preserve strong auditability and structured operational traceability.

Auditability means every critical system action can later be reviewed and verified. Examples include:

- Who submitted a request
- When the request occurred
- What processing actions occurred
- Whether notifications succeeded
- Whether failures occurred during processing

Privacy-aware data handling means collecting, processing, storing, and exposing only the minimum necessary information while protecting it from misuse, leakage, or unauthorized access.

The platform should also support future extensibility because enterprise healthcare systems commonly integrate with:

- CRM systems
- Pharmacovigilance platforms
- Analytics systems
- Reporting pipelines
- Identity providers
- Internal workflow engines
- Medical content repositories

---

# Frontend Technology Requirements

Use Next.js 14 with the App Router architecture.

Next.js is a React framework that provides:

- Server-side rendering
- Route handlers
- Metadata APIs
- SEO tooling
- Optimized asset handling
- Scalable application architecture

Use React 18 for component-driven UI development.

React is a frontend library used to create reusable interactive interfaces through isolated composable components. Component-driven architecture improves maintainability and scalability.

Use TypeScript across the entire application.

TypeScript is a statically typed superset of JavaScript that introduces:

- Compile-time type safety
- Structured contracts
- Improved developer tooling
- Safer refactoring

Use Tailwind CSS for styling.

Tailwind CSS is a utility-first CSS framework used to rapidly build consistent design systems without large custom stylesheet overhead.

Use Framer Motion for animations and interaction transitions.

Framer Motion is a React animation library used to implement performant motion and interaction patterns that improve usability and user feedback.

The frontend experience should feel:

- Professional
- Calm
- Accessible
- Trustworthy
- Operationally reliable

Avoid marketing-heavy or overly decorative user interfaces.

---

# Backend Technology Requirements

Use Next.js Route Handlers or modular Node.js route handlers for backend APIs.

Route handlers are server-side endpoints responsible for:

- Processing HTTP requests
- Validating payloads
- Executing business logic
- Returning secure structured responses

Use modular service-oriented architecture.

Modular service architecture separates responsibilities into isolated reusable services such as:

- Validation services
- Logging services
- Database services
- Notification services
- Security utilities
- Rate-limiting middleware

This improves:

- Maintainability
- Scalability
- Extensibility
- Operational ownership

---

# Database Requirements

Use PostgreSQL as the primary relational database.

PostgreSQL is an enterprise-grade relational database system known for:

- Transactional consistency
- Structured querying
- Reliability
- Strong data integrity guarantees

Use Prisma ORM for database interaction.

Prisma ORM is a type-safe database access layer that improves developer productivity while preserving relational modeling and typed query behavior.

Use relational modeling principles.

Relational modeling organizes structured data into connected entities with clearly defined relationships. This is important because regulated healthcare systems require:

- Traceability
- Reporting support
- Workflow categorization
- Auditability

The platform must store:

- Inquiry records
- Tracking identifiers
- Audit metadata
- Request status
- Notification outcomes
- Hashed requester identifiers
- Timestamp information

---

# Validation and Sanitization Requirements

Use `validator.js` and shared typed validation utilities.

Validation is the process of ensuring incoming data satisfies business, operational, and security requirements before processing occurs.

The platform must validate:

- Required fields
- Email format
- Phone format
- Country presence
- Allowed inquiry types
- Consent confirmation
- Minimum message length
- Payload structure
- Invalid enum values
- Empty submissions
- Duplicate malformed payloads

The message field must contain at least twenty meaningful characters to reduce spam and unusable submissions.

Use DOMPurify for sanitization.

Sanitization is the process of cleaning user-provided content to remove:

- Unsafe scripts
- Embedded payloads
- Executable browser code
- Malicious HTML
- Injection attempts

The platform must sanitize all free-text content before:

- Database persistence
- Email rendering
- Logging
- Audit storage
- Internal notification generation

This protects against Cross-Site Scripting (XSS).

XSS is a browser-based security vulnerability where malicious executable code is injected into trusted applications.

---

# Authentication and Security Requirements

Use JWT-based security utilities where appropriate.

JWT stands for JSON Web Token, which is a compact cryptographically signed token format commonly used for authentication and secure service communication.

Use secure environment variables for all secrets and infrastructure credentials.

Environment variables are externally managed runtime configuration values used to securely store:

- Database URLs
- API credentials
- JWT secrets
- Mail provider credentials
- Public site URLs
- Encryption keys

Secrets must never be hardcoded into source code.

Use secure HTTP headers.

Secure headers are browser-facing HTTP response headers used to improve application security behavior.

Examples include:

- Content Security Policy
- X-Frame-Options
- Strict-Transport-Security
- Referrer-Policy

Use rate limiting.

Rate limiting is the process of restricting how frequently clients may perform actions within a defined time window.

The platform must limit submissions to:

```text
5 requests per hashed IP address per hour
```

A hashed IP address means the original IP address is transformed into a non-reversible secure representation before storage or logging.

Use defensive programming practices.

Defensive programming is the practice of designing systems assuming:

- Invalid input
- Operational failures
- Abuse attempts
- Malicious behavior

may occur at any time.

---

# Error Handling and Failure Management Requirements

The platform must include comprehensive error handling across:

- Frontend workflows
- Backend services
- Infrastructure layers
- Operational processing pipelines

Error handling is the controlled detection, management, logging, and recovery process used when unexpected conditions occur.

The implementation must use structured `try/catch` handling for backend processing logic.

Try/catch handling is a controlled programming pattern used to safely manage runtime failures without crashing the application or exposing internal implementation details.

The system must gracefully handle:

- Validation failures
- Database connectivity failures
- Rate limit violations
- Invalid request payloads
- Duplicate submissions
- Email delivery failures
- Timeout conditions
- Unexpected server exceptions
- Malformed JSON payloads
- Missing environment variables
- Internal service failures
- Dependency initialization failures

Validation failures must return HTTP `400` responses.

HTTP 400 indicates malformed input or invalid request data.

Rate-limited requests must return HTTP `429` responses.

HTTP 429 indicates excessive request frequency beyond allowed thresholds.

Unexpected server failures must return HTTP `500` responses.

HTTP 500 represents internal server errors caused by unexpected backend failures.

The API must never expose:

- Stack traces
- Database details
- Internal infrastructure information
- Sensitive runtime metadata
- Secret values
- Framework internals

All errors must return structured predictable response contracts.

The frontend must include user-friendly recovery states for:

- Validation failures
- Network interruptions
- Submission failures
- Expired sessions
- Rate limit errors
- Unexpected API failures

The submit button must prevent duplicate submissions while requests remain in-flight.

The platform must include operational logging for all failure conditions.

Operational logging refers to recording structured system events for:

- Debugging
- Auditing
- Incident investigation
- Production monitoring

Critical backend failures should generate audit logs containing:

- Timestamp
- Tracking ID
- Failure category
- Request correlation identifier
- Processing stage
- Sanitized diagnostic metadata

A request correlation identifier is a unique operational identifier attached to a request lifecycle to support debugging and distributed tracing.

The application should fail gracefully wherever possible.

Graceful failure means the system continues operating safely while providing meaningful recovery behavior instead of crashing or exposing sensitive implementation details.

---

# Email Infrastructure Requirements

Use Nodemailer with Mailgun-compatible transport configuration.

Nodemailer is a Node.js email delivery library used for transactional email workflows.

Mailgun is a cloud-based email delivery provider commonly used for scalable production email infrastructure.

Transactional emails are operational emails automatically triggered by system events.

The platform must:

- Send internal medical information notifications
- Send requester acknowledgment emails
- Include tracking IDs in communications
- Avoid leaking sensitive infrastructure details
- Support environment-based configuration

The system must gracefully handle email delivery failures without losing inquiry persistence.

If email delivery fails after successful database persistence, the inquiry must still remain stored while generating structured operational logs for retry or investigation.

---

# MIR Form Requirements

The MIR form must collect the following fields:

## Full Name

Full Name refers to the professional identity of the requester and supports communication workflows and audit traceability.

## HCP Role

HCP Role refers to the professional medical position of the requester such as:

- Physician
- Pharmacist
- Nurse

## Institution

Institution refers to the healthcare organization associated with the requester such as:

- Hospital
- University
- Clinic
- Healthcare network

## Email Address

Email Address is required for acknowledgment communication and operational follow-up.

## Phone Number

Phone Number supports escalation workflows and urgent contact handling.

## Country

Country supports:

- Regional routing
- Localization
- Compliance handling
- Operational assignment

## Product

Product identifies the pharmaceutical product associated with the inquiry.

## Inquiry Type

Inquiry Type is a classification describing the category of the request.

Supported categories include:

- Medical Information
- Product Availability
- Dosage & Administration
- Clinical Data
- Safety Information
- Adverse Event
- Product Complaint
- Literature Request
- Other

## Message

Message represents the detailed inquiry content and must contain at least twenty meaningful characters.

## Consent Confirmation

Consent Confirmation is an explicit acknowledgment permitting data processing and communication handling.

---

# Tracking ID Requirement

Generate unique tracking IDs using the following format:

```text
MIR-YYYYMMDD-XXXXXX
```

Example:

```text
MIR-20260526-A1B2C3
```

A tracking identifier is a human-readable operational reference ID used for:

- Auditability
- Workflow tracing
- Customer support handling
- Operational investigation

Tracking IDs must remain unique and collision-resistant.

---

# Accessibility Requirements

The frontend must follow WCAG-compliant accessibility practices.

WCAG stands for Web Content Accessibility Guidelines, which define internationally recognized standards for accessible digital experiences.

The platform must include:

- Proper labels
- Keyboard navigation
- Visible validation states
- Focus management
- Screen-reader compatibility
- ARIA attributes
- Accessible modal behavior
- Focus trapping
- Semantic HTML structure
- Reduced motion support

Keyboard navigation means users must be able to operate the entire application without a mouse.

Focus management refers to controlling keyboard focus behavior during:

- Validation flows
- Modal interactions
- Dynamic UI changes

ARIA attributes are accessibility metadata attached to HTML elements to improve assistive technology compatibility.

Reduced motion support means respecting operating-system accessibility preferences for users sensitive to animated motion.

---

# SEO and Structured Data Requirements

The platform must include:

- Metadata APIs
- Open Graph metadata
- JSON-LD structured data

SEO stands for Search Engine Optimization and refers to practices improving indexing and discoverability.

Open Graph metadata controls how pages appear when shared across social platforms.

JSON-LD is a structured machine-readable metadata format used by search engines and indexing systems.

Include structured schema data for:

- Pharmaceutical organization information
- ContactAction interactions
- Corporate metadata

ContactAction schema is a semantic metadata structure describing inquiry and communication interactions.

---

# Logging and Observability Requirements

The platform must include structured audit logging.

Audit logging refers to recording important operational system actions for:

- Compliance review
- Debugging
- Traceability
- Incident investigation
- Operational analysis

Logs should include:

- Tracking IDs
- Timestamps
- Inquiry categories
- Request outcomes
- Notification outcomes
- Failure categories
- Hashed requester identifiers
- Correlation identifiers

The system should support observability principles.

Observability refers to the ability to understand internal system behavior using:

- Logs
- Metrics
- Traces
- Operational telemetry

---

# API Response Requirements

The backend API must use structured response contracts.

A structured response contract is a predictable and standardized API response format consistently returned across all endpoints.

Successful responses must follow this exact structure:

```json
{
  "success": true,
  "trackingId": "MIR-20260526-A1B2C3",
  "message": "Inquiry submitted successfully.",
  "errors": []
}
```

Validation failures must return structured error arrays with HTTP `400` responses.

Rate limit violations must return HTTP `429` responses.

Unexpected backend failures must return HTTP `500` responses without leaking internal implementation details.

---

# Deployment and Operational Requirements

The implementation must demonstrate production readiness.

Production readiness refers to the ability of software to safely, reliably, securely, and maintainably operate in real-world environments.

The architecture must support scalability.

Scalability refers to the ability of a system to handle increasing:

- Traffic
- Operational complexity
- Integrations
- User growth

without major redesign.

The implementation must prioritize maintainability.

Maintainability refers to how easily developers can:

- Understand
- Debug
- Modify
- Extend
- Operate

the system over time.

The architecture should support extensibility.

Extensibility refers to the ability to add future workflows, integrations, and features without large architectural rewrites.

The implementation should demonstrate reliability engineering practices.

Reliability engineering refers to designing systems that continue operating consistently while recovering gracefully from failures and operational disruptions.

---

# Final Quality Expectations

The final implementation should read like a serious enterprise healthcare engineering deliverable written by an experienced engineer communicating with another experienced engineer.

Avoid:

- Vague marketing language
- Shallow pseudocode
- Unrealistic simplifications
- Excessive buzzwords
- Toy-level architecture decisions

The implementation should demonstrate:

- Security maturity
- Regulatory realism
- Accessibility awareness
- Backend reliability
- Operational resilience
- Maintainable architecture
- Production-oriented engineering
- Structured error handling
- Defensive programming practices
- Realistic enterprise software design
- Scalable modular architecture
- Practical operational thinking
