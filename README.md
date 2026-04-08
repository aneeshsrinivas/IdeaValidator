# AI Startup Idea Validator

A production-grade, serverless full-stack application that accepts startup ideas and returns structured, AI-generated validation reports — covering market positioning, competitor landscape, risk assessment, and profitability scoring. Built as a unified Next.js 14 monolith with a Neon PostgreSQL backend and Meta Llama 3 (8B) via the Hugging Face Inference API.

---

## Live Deployment

**Vercel Production:** [https://idea-validator-d3gy.vercel.app/](https://idea-validator-d3gy.vercel.app/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [AI Integration](#ai-integration)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Design Decisions](#design-decisions)

---

## Overview

The AI Startup Idea Validator addresses a common friction point for early-stage founders: the absence of fast, structured, objective feedback on new business ideas. Traditional validation requires market research hours, consultant fees, and founder bias. This application compresses that process into seconds by submitting an idea title and description to a fine-tuned LLM pipeline, which returns a deterministic JSON report containing a problem breakdown, customer persona, market analysis, competitor differentiation, recommended tech stack, risk classification, and a quantitative profitability score.

The application is entirely serverless — there is no separate backend process to manage. API logic, database access, and AI inference are co-located within Next.js API routes and deployed atomically to Vercel's edge infrastructure.

---

## Features

- Submit a startup idea via a clean, minimal form interface
- Receive a structured AI-generated validation report within seconds
- View a persistent dashboard of all previously submitted and analyzed ideas
- Navigate to individual detail pages with full report breakdowns
- Delete ideas from the database via the dashboard
- Fully responsive UI built with Tailwind CSS
- Zero-latency cold starts courtesy of Neon's serverless PostgreSQL driver
- Strict JSON schema enforcement on AI outputs with server-side validation

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 14 (App Router) | Full-stack React framework with file-based routing and API routes |
| Language | TypeScript | End-to-end type safety across client components and server handlers |
| Styling | Tailwind CSS | Utility-first CSS framework for rapid, consistent UI development |
| Database | Neon PostgreSQL | Serverless, scalable Postgres with HTTP-based driver for edge compatibility |
| AI Model | Meta Llama 3 8B (Hugging Face) | Open-weight LLM used for structured startup analysis via Inference API |
| ORM / Query | Raw SQL via `@neondatabase/serverless` | Lightweight query layer without ORM overhead |
| Deployment | Vercel | Serverless deployment with automatic CI/CD from GitHub |
| Runtime | Node.js (Vercel Serverless Functions) | Execution environment for API route handlers |

---

## Architecture

The application follows a unified monolithic architecture enabled by Next.js 14's App Router. All routing, data fetching, and API handling live within a single deployable unit — eliminating the coordination overhead of separate frontend and backend services.

Client (Browser)
│
▼
Next.js App Router (Vercel Serverless)
├── /app                  → React Server & Client Components
│     ├── page.tsx        → Idea submission form
│     ├── dashboard/      → Saved ideas listing
│     └── ideas/[id]/     → Detail view for individual reports
│
└── /app/api
├── ideas/route.ts         → POST (create + analyze), GET (list)
└── ideas/[id]/route.ts    → GET (detail), DELETE (remove)
│
├── Hugging Face Inference API
│     └── Meta Llama 3 8B → Structured JSON report
│
└── Neon PostgreSQL
└── ideas table → Persistent report storage

**Request lifecycle for idea submission:**

1. User submits title and description via the frontend form.
2. `POST /api/ideas` receives the payload and constructs a structured prompt.
3. The prompt is sent to Hugging Face's Inference API targeting `meta-llama/Meta-Llama-3-8B-Instruct`.
4. The raw model response is parsed, validated, and coerced into the expected schema.
5. The validated report is persisted to Neon PostgreSQL alongside the original submission metadata.
6. The response — including the generated UUID and report — is returned to the client.
7. The user is redirected to the detail page for the newly created report.

---

## Project Structure
idea-validator/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                     # Idea submission form
│   ├── dashboard/
│   │   └── page.tsx                 # Ideas listing dashboard
│   ├── ideas/
│   │   └── [id]/
│   │       └── page.tsx             # Individual report detail page
│   └── api/
│       └── ideas/
│           ├── route.ts             # POST /api/ideas, GET /api/ideas
│           └── [id]/
│               └── route.ts         # GET /api/ideas/:id, DELETE /api/ideas/:id
├── lib/
│   ├── db.ts                        # Neon database client
│   └── types.ts                     # Shared TypeScript interfaces
├── components/                      # Reusable UI components
├── public/
├── .env.local                       # Local environment variables (not committed)
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A [Neon](https://neon.tech) account with an active project
- A [Hugging Face](https://huggingface.co) account with Inference API access

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/idea-validator.git
cd idea-validator

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Fill in DATABASE_URL and HUGGINGFACE_API_KEY (see Environment Variables section)

# Initialize the database schema
# Run the SQL in the Database Schema section below against your Neon project

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Environment Variables

Create a `.env.local` file in the root of the project with the following variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string (found in your Neon project dashboard under Connection Details) |
| `HUGGINGFACE_API_KEY` | Hugging Face API token with Inference API access (generated at huggingface.co/settings/tokens) |

**Example `.env.local`:**

```env
DATABASE_URL=postgresql://username:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

These variables must also be added to your Vercel project's environment settings for production deployment.

---

## API Reference

### `POST /api/ideas`

Submits a new startup idea for AI analysis. Triggers the Hugging Face inference pipeline and persists the result to the database.

**Request Body:**
```json
{
  "title": "string",
  "description": "string"
}
```

**Response — `201 Created`:**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "report": { ... },
  "created_at": "ISO 8601 timestamp"
}
```

---

### `GET /api/ideas`

Returns a summary list of all analyzed startup ideas, ordered by creation date descending.

**Response — `200 OK`:**
```json
[
  {
    "id": "uuid",
    "title": "string",
    "profitability_score": 72,
    "risk_level": "Medium",
    "created_at": "ISO 8601 timestamp"
  }
]
```

---

### `GET /api/ideas/:id`

Returns the complete validation report for a specific idea, identified by its UUID.

**Response — `200 OK`:**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "report": {
    "problem": "string",
    "customer": "string",
    "market": "string",
    "competitor": [
      { "name": "string", "differentiation": "string" }
    ],
    "tech_stack": ["string"],
    "risk_level": "Low | Medium | High",
    "profitability_score": 0,
    "justification": "string"
  },
  "created_at": "ISO 8601 timestamp"
}
```

---

### `DELETE /api/ideas/:id`

Permanently removes a startup idea and its associated report from the database.

**Response — `200 OK`:**
```json
{ "message": "Idea deleted successfully." }
```

---

## AI Integration

**Model:** `meta-llama/Meta-Llama-3-8B-Instruct` via Hugging Face Inference API

**System Prompt:**
You are an expert startup consultant. Analyze the given startup idea and return a structured JSON object with the following fields: problem, customer, market, competitor, tech_stack, risk_level, profitability_score, justification.
Rules:

Keep answers concise and realistic.
The competitor field must contain exactly 3 objects, each with a name field and a differentiation field.
The tech_stack field must be an array of 4 to 6 strings.
The profitability_score must be an integer between 0 and 100.
The risk_level must be exactly one of: Low, Medium, or High.
Return ONLY valid JSON with no markdown formatting, no backticks, and no text outside the JSON object.

Input: { "title": "<title>", "description": "<description>" }

Inference is performed with a low temperature setting to maximize output determinism and schema compliance. The raw response string undergoes server-side JSON parsing and field-level validation before any database write occurs, preventing corrupt or partial reports from being stored.

---

## Database Schema

Run the following against your Neon PostgreSQL instance to initialize the schema:

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS ideas (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT          NOT NULL,
  description TEXT          NOT NULL,
  report      JSONB         NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
```

The `report` column stores the full AI-generated JSON object as a `JSONB` field, enabling efficient querying and indexing on nested report properties if needed in future iterations.

---

## Deployment

The application is deployed to Vercel with automatic deployments triggered on every push to the `main` branch.

**Steps to deploy your own instance:**

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add `DATABASE_URL` and `HUGGINGFACE_API_KEY` under Project Settings → Environment Variables.
4. Trigger a deployment. Vercel will auto-detect Next.js and configure the build pipeline.

No additional configuration is required. Next.js API routes are deployed as isolated serverless functions.

---

## Design Decisions

**Unified Next.js monolith over separate frontend/backend services.** Co-locating the API routes and React components within a single Next.js project reduces deployment complexity, eliminates cross-origin configuration, and allows TypeScript interfaces to be shared directly between the server-side handlers and the client-side components without duplication or code generation tooling.

**Neon PostgreSQL over MongoDB or Supabase.** Neon's HTTP-based serverless driver is purpose-built for edge and serverless environments. It avoids the persistent TCP connection model of traditional PostgreSQL clients, which causes connection exhaustion on serverless platforms like Vercel. Neon handles connection pooling transparently, resulting in consistent cold-start behavior and no infrastructure overhead.

**Meta Llama 3 8B over GPT-4 or Gemini.** The Hugging Face Inference API provides access to Llama 3 without metered per-token billing under standard usage, making it more suitable for a rapid MVP with unpredictable inference volume. Llama 3's instruction-tuned variant responds reliably to strict JSON-only system prompts, meeting the schema requirements without the need for function calling or response format APIs.

**JSONB storage for AI reports.** Storing the report as a `JSONB` column rather than normalizing it into relational tables preserves schema flexibility. As the AI prompt evolves and new report fields are introduced, no database migrations are required — the new fields are persisted automatically.
