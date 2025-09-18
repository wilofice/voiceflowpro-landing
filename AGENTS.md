# Repository Guidelines

## Project Structure & Module Organization
The React client lives in `client/src`, with shared UI in `components`, routed screens in `pages`, custom hooks in `hooks`, utilities in `lib`, and global styles in `index.css`. The Express backend sits in `server`: `index.ts` wires middleware, `routes.ts` exposes Stripe and form APIs, and `storage.ts` provides the in-memory store. Shared Zod schemas stay in `shared/schema.ts`. Root-level configs (`vite.config.ts`, `tailwind.config.ts`, `drizzle.config.ts`) drive bundling and styling. Path aliases map `@/` to `client/src` and `@shared/` to `shared`.

## Build, Test, and Development Commands
- `npm install`: install all dependencies.
- `npm run dev`: start Express with the Vite dev server at `http://localhost:5000`.
- `npm run build`: compile the Vite client and bundle the server into `dist/`.
- `npm run start`: serve the production build from `dist/index.js`.
- `npm run check`: run a strict TypeScript pass prior to pushing.
- `npm run db:push`: apply Drizzle schema updates to the configured database.

## Coding Style & Naming Conventions
Write modern TypeScript with functional React components, 2-space indentation, and the existing no-semicolon style. Use `PascalCase` for components, `camelCase` for functions and variables, and `SCREAMING_SNAKE_CASE` for environment keys. Co-locate feature code and prefer Tailwind utility classes, extracting variants with `class-variance-authority` when duplication appears. Always validate inbound payloads through the Zod schemas in `shared/schema.ts` before calling storage or Stripe.

## Testing Guidelines
The project does not yet ship automated tests, so new work should add Vitest (UI) or Supertest (API) coverage as appropriate. Co-locate specs next to the source as `*.test.ts` or `*.test.tsx`, stub Stripe calls with official test keys, and keep fixtures small. Target at least 80% line coverage on the modules you touch and document any intentional gaps. Run `npm run check` plus your test suite before requesting review.

## Commit & Pull Request Guidelines
Follow the existing history by writing imperative, sentence-case commit subjects (e.g., “Add pricing hero animation”) and keeping each commit focused. Pull requests must include a concise summary, linked issues, notes on config or env changes, and manual test steps or relevant screenshots for UI updates.

## Security & Configuration Tips
Store secrets such as `STRIPE_SECRET_KEY` in a local `.env` and never commit them. Use Stripe test keys outside production and gate experimental logs behind `NODE_ENV !== 'production'`. Confirm database connectivity before running `npm run db:push`, and avoid logging raw payment payloads to protect user data.
