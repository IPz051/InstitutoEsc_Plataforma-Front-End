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

## Internationalisation (i18n)

### Stack

- **Library**: `next-intl` (cookie-based locale, no URL prefix)
- **Active locale**: **Portuguese only, for now.** `i18n/request.ts` is locked to `DEFAULT_LOCALE` (`pt`); the cookie read and the `<LocaleSwitcher/>` (login + navbar) are disabled. English is **not** currently selectable.
- **Default locale**: `pt` (Portuguese) — see `DEFAULT_LOCALE` in `i18n/config.ts`
- **Supported locales (defined)**: `en`, `pt` — `en` is kept defined but dormant
- **Dictionaries**: `messages/pt.json` (active) and `messages/en.json` (kept in sync but dormant)
- **Re-enabling English**: restore the cookie read in `i18n/request.ts`, re-add `<LocaleSwitcher/>` to `AppNavbar`/login, and flip `DEFAULT_LOCALE` if English should be default.
- **Config**: `i18n/request.ts` (forces `pt`), `i18n/config.ts` (shared constants)

### Translation patterns

```tsx
// Server component
import { getTranslations, getFormatter } from "next-intl/server"
export default async function MyPage() {
  const t = await getTranslations()
  const format = await getFormatter()
  return <h1>{t("dashboard.title")}</h1>
}

// Client component
"use client"
import { useTranslations, useFormatter } from "next-intl"
export function MyComponent() {
  const t = useTranslations()
  const format = useFormatter()
  return <p>{t("courses.lessonCount", { count: 12 })}</p>
}
```

### Namespaces

| Namespace | Contents |
|-----------|----------|
| `meta` | Page `<title>` and description |
| `common` | Shared: back, close, search, notifications, cancel, description, readMore/Less |
| `nav` | Sidebar nav labels, search placeholder, sign-out |
| `enums` | Status/type display strings: `courseStatus`, `inPersonStatus`, `certificateStatus`, `eventType`, `courseFilter` |
| `auth.login` | Login page chrome |
| `dashboard` | Dashboard page chrome |
| `courses` | Courses list + detail chrome |
| `onlineTraining` | Online-training list + detail chrome |
| `inPersonCourses` | In-person course detail chrome |
| `lesson` | Lesson player chrome |
| `exam` | Exam chrome |
| `certificates` | Certificates page chrome |
| `calendar` | Calendar page chrome |
| `community` | Community page + feed chrome |
| `admin` | Admin panel chrome |
| `prevsummit` | PrevSummit page chrome |
| `sunsetPrev` | Sunset Prev page chrome |

### Key conventions (from migration plan 00)

- **Code identifiers** (variables, types, enums, route segments, asset folders): English, `camelCase` or `kebab-case`
- **Route segments**: English kebab-case (`/online-training`, `/in-person-courses`, `/lesson/`, `/exam/`)
- **Asset paths** (`public/`): English kebab-case (`/free-courses/`, `/professor-tags/`, `/logos/`)
- **Message keys**: `camelCase` namespace dot `camelCase` key; hyphenated enum values use `"key"` bracket notation in ICU
- **Content stays Portuguese**: course/lesson titles, professor names and bios, exam question text, community post bodies, mock data strings
- **Chrome is translated**: nav labels, button text, headings, placeholders, aria-labels, badge text, empty states

### Adding a new string

1. Add the key to **both** `messages/en.json` and `messages/pt.json`
2. Use `t("namespace.key")` or `t("namespace.key", { param })` in the component
3. Run `pnpm exec tsc --noEmit` to confirm no type regressions

### Locale-aware formatting

Use `format.dateTime(date, options)` from `useFormatter` (client) or `getFormatter` (server) instead of `toLocaleDateString`. Never hardcode `"pt-BR"` as a locale argument — let next-intl drive it from the active locale.
