# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (Next.js, port 3000)
pnpm build      # Production build (TypeScript errors ignored — see next.config.mjs)
pnpm lint       # ESLint
```

No tests are configured in this project.

## Architecture

This is a **Next.js 16 (App Router) frontend-only prototype** for Instituto ESC's student platform. It uses the `(app)` route group to apply a shared sidebar layout to all authenticated pages.

### Route structure

- `app/page.tsx` — Login page (root, public)
- `app/(app)/` — All authenticated routes; wrapped by `AppSidebar` + `SidebarInset`
  - `dashboard/`, `online-training/`, `courses/`, `in-person-courses/`, `certificates/`, `calendar/`, `community/`, `admin/`, `prevsummit-international/`, `sunset-prev/`
  - Dynamic routes follow the pattern `/[courseId]/lesson/[lessonId]` and `/[courseId]/exam/[examId]`
- Old PT URLs (`/cursos`, `/calendario`, `/formacao-online`, `?tipo=livres`, `/aula/`, `/prova/`) permanently redirect to their EN counterparts (configured in `next.config.mjs`).

### Data layer

All data is mocked — there is no API integration yet. Everything lives in `lib/mock-data.ts`, which exports typed interfaces (`Course`, `InPersonCourse`, `Lesson`, `Exam`, `Module`, `Certificate`, `CommunityPost`, etc.) and a `student` constant. Helper functions like `getFreeLessonContext` are consumed directly by page server components.

The backend API contracts exist in `docs/contracts/` (Spring Boot at `http://localhost:8080`):
- `POST /auth/login` → `{ accessToken, refreshToken }` (accessToken: 15 min, refreshToken: 7 days)
- `POST /auth/refresh` → `{ accessToken }` (no rotation)
- `GET /users/current` → user profile (requires `Authorization: Bearer <accessToken>`)

> ⚠️ Login failures currently return `500` (not `401`) from the backend — treat any non-`200` as failed login.

### UI components

- `components/ui/` — shadcn/ui components (style: `base-nova`, Tailwind CSS v4)
- `components/` — shared app-level components: `AppSidebar`, `AppNavbar`, `LessonView`, `ExamView`, `CourseCard`, `CommunityFeed`, etc.
- Icons: lucide-react
- Fonts: Geist Sans, Geist Mono, Poppins (via `next/font/google`)
- Toasts: sonner (`<Toaster />` in root layout)

### Styling

Tailwind CSS v4 with CSS variables for theming. Global styles and CSS variable definitions are in `app/globals.css`. The `cn()` utility is at `lib/utils.ts` (clsx + tailwind-merge).

### Path aliases

`@/` maps to the project root (configured in `tsconfig.json` and `components.json`).

---

## Services & Types

### Structure

```
services/
  api.ts                  # axios instance + interceptors (base URL, auth header)
  <domain>/
    <domain>Service.ts    # functions for each endpoint in the domain
types/
  index.ts                # all TypeScript types/interfaces centralized here
```

### File naming conventions

- Service files: **camelCase** — `authService.ts`, `usersService.ts`
- All types/interfaces live in **`types/index.ts`** — never colocate `.types.ts` files next to services
- Import types always from `@/types`, never from relative paths

### Adding a new domain

1. Create `services/<domain>/<domain>Service.ts`
2. Add the domain's types to `types/index.ts`
3. Import the axios instance from `@/services/api`

### Existing domains

| Domain | File | Endpoints |
|--------|------|-----------|
| `auth` | `services/auth/authService.ts` | `POST /auth/login`, `POST /auth/refresh` |
| `users` | `services/users/usersService.ts` | `GET /users/current` |
