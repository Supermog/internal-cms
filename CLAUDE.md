# CLAUDE.md

This file provides guidance for Claude Code (claude.ai/code) when working with this codebase.

## Project Overview

Internal-CMS is a monorepo containing an internal content management system built with:

- **Frontend**: React + Vite + TypeScript (apps/client)
- **Backend**: NestJS + TypeScript (apps/api)
- **Shared**: Common types, DTOs, and utilities (packages/shared)
- **Database**: Supabase (PostgreSQL)
- **Monorepo Tool**: Turborepo with npm workspaces

## Common Commands

### Development

```bash
# Start all apps in development mode (from root)
npm run dev

# Start individual apps
cd apps/api && npm run dev      # NestJS API on port 3000
cd apps/client && npm run dev   # Vite dev server on port 5173
```

### Build

```bash
# Build all packages and apps
npm run build

# Build shared package (must be built before apps can use it)
cd packages/shared && npm run build
```

### Testing (API only)

```bash
cd apps/api
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

### Linting & Formatting

```bash
cd apps/api && npm run lint      # Lint API
cd apps/api && npm run format    # Format API with Prettier
cd apps/client && npm run lint   # Lint client
```

### Database Types Generation

```bash
# Generate Supabase types (requires Supabase CLI and login)
npx supabase gen types typescript --project-id <project-id> > packages/shared/src/types/database/database.types.ts
```

## Architecture

### Monorepo Structure

```
├── apps/
│   ├── api/          # NestJS backend
│   └── client/       # React frontend
├── packages/
│   └── shared/       # Shared types, DTOs, utilities
├── turbo.json        # Turborepo config
└── package.json      # Root workspace config
```

### Backend (apps/api)

- **Framework**: NestJS with Express
- **Authentication**: JWT via Supabase Auth, validated with passport-jwt
- **Modules**: auth, client, invite, mail
- **Global Guard**: JwtAuthGuard applied to all routes by default
- **Public Routes**: Use `@Public()` decorator to bypass auth

Key patterns:

- Controllers in `src/modules/<module>/<module>.controller.ts`
- Services in `src/modules/<module>/<module>.service.ts`
- DTOs imported from `@internal-cms/shared`
- Supabase client configured in `src/config/supabase.config.ts`

### Frontend (apps/client)

- **Framework**: React 18 with Vite
- **Routing**: react-router-dom v6
- **State Management**: TanStack Query (React Query)
- **Forms**: react-hook-form + zod validation
- **UI Components**: Radix UI primitives + Tailwind CSS
- **Icons**: lucide-react

Key patterns:

- Pages in `src/app/pages/`
- Features organized by domain in `src/features/<feature>/`
  - `api/` - React Query hooks for API calls
  - `components/` - Feature-specific components
  - `types/` - Zod schemas and types
- Shared UI components in `src/components/ui/`
- Route paths centralized in `src/app/config/route-paths.config.ts`
- Auth guards: `AuthGuard` (requires login), `GuestGuard` (requires logged out)

### Shared Package (packages/shared)

- **Build Tool**: tsup (outputs ESM + CJS)
- Contains: Database types, DTOs with class-validator decorators, Zod schemas, utility functions
- Must be built before apps can import from it

Import in apps:

```typescript
import { Client, CreateClientDto, Constants } from "@internal-cms/shared";
```

## Environment Variables

API requires `.env.local` or `.env` in `apps/api/`:

- `PORT` - API port (default: 3000)
- `SUPABASE_PROJECT_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `MAILJET_API_KEY`, `MAILJET_SECRET_KEY` - Email service credentials
- `FRONTEND_URL` - Frontend URL for CORS and email links
- `ALLOWED_ORIGINS` - Additional CORS origins (comma-separated)

## Code Style Guidelines

- Use TypeScript strict mode
- Follow existing patterns for new features (check similar files)
- Use lodash-es for utility functions (frontend)
- Prefer named exports over default exports
- Use Zod schemas for frontend form validation
- Use class-validator decorators for backend DTOs
- Keep components focused - split into smaller components when needed

## Adding New Features

### New API Endpoint

1. Add DTO in `packages/shared/src/types/`
2. Export from `packages/shared/src/index.ts`
3. Rebuild shared: `cd packages/shared && npm run build`
4. Create/update controller and service in `apps/api/src/modules/`

### New Frontend Feature

1. Create feature folder in `apps/client/src/features/<feature>/`
2. Add API hooks in `api/` subfolder using React Query
3. Add components in `components/` subfolder
4. Add route in `apps/client/src/app/router.tsx`
5. Add route path in `apps/client/src/app/config/route-paths.config.ts`

### New UI Component

1. Add to `apps/client/src/components/ui/`
2. Use Radix UI primitives where applicable
3. Style with Tailwind CSS + class-variance-authority for variants
