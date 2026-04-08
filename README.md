# AI Startup Idea Validator
A sophisticated, serverless application that uses AI to analyze and score startup ideas.

## Live Demo
[View Live Demo on Vercel](https://your-vercel-deployment-url-here.vercel.app/)

## Tech Stack
- Next.js 14 (App Router)
- Neon PostgreSQL
- Hugging Face API (Llama 3 8B)
- Tailwind CSS

## Getting Started
1. Clone the repo
2. Run `npm install`
3. Create a `.env.local` file with two keys: `DATABASE_URL` and `HUGGINGFACE_API_KEY`
4. Run `npm run dev`
5. Open `localhost:3000`

## Environment Variables
| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `HUGGINGFACE_API_KEY` | Hugging Face API key |

## API Endpoints
| Endpoint | Description |
|---|---|
| `POST /api/ideas` | Submits a new idea title and description to be analyzed by AI and stored in the database. |
| `GET /api/ideas` | Fetches a summary list of all previously analyzed startup ideas. |
| `GET /api/ideas/[id]` | Fetches the complete, detailed analysis report for a specific idea via its UUID. |
| `DELETE /api/ideas/[id]` | Deletes a specific idea from the database using its UUID. |

## AI Prompt Used
```text
You are an expert startup consultant. Analyze the given startup idea and return a structured JSON object with the fields: problem, customer, market, competitor, tech_stack, risk_level, profitability_score, justification. Rules: Keep answers concise and realistic. The competitor field must contain exactly 3 objects each with a name field and a differentiation field. The tech_stack field must be an array of 4 to 6 strings. The profitability_score must be an integer between 0 and 100. The risk_level must be exactly one of: Low, Medium, or High. Return ONLY valid JSON with no markdown formatting, no backticks, and no text outside the JSON object.
```

## Architecture Decisions

The frontend and backend are tightly integrated using Next.js API routes. This colocation strategy reduces context switching, simplifies deployment, and allows the seamless sharing of TypeScript interfaces between the client data visualization components and the server execution logic.

We elected to use the Hugging Face API with the Meta Llama 3 8B model to ensure predictable scaling and to avoid Google Gemini billing limitations. By providing strict system prompts and low temperatures, Llama 3 generates reliable, strict JSON structures compatible with our automated validation pipeline.

For persistent storage, we migrated to Neon PostgreSQL. Because Neon is designed specifically for serverless edge deployments, it guarantees zero cold start penalties when spinning up on Vercel. It completely abstracts connection pooling, allowing the application to scale efficiently without the complex socket handling issues that plague traditional integration on serverless platforms.
