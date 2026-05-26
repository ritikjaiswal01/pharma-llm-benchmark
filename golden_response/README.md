# Enterprise Pharmaceutical MIR Platform

This project implements a secure Medical Information Request platform for healthcare professionals.

## Quick Start

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Core Flow

1. HCP opens the MIR modal from the landing page.
2. Client prevents duplicate submission while the form is in flight.
3. API validates and sanitizes the request.
4. Server hashes the requester IP and checks the 5-per-hour limit.
5. Prisma stores the inquiry and audit event in one transaction.
6. Mailgun-backed email sends internal and requester notifications.
7. API returns a tracking ID in the required response shape.

## Required Response Shape

```json
{
  "success": true,
  "trackingId": "MIR-20260526-A1B2C3",
  "message": "Inquiry submitted successfully.",
  "errors": []
}
```
