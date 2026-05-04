# PlayQuest Workspace

## Overview

pnpm workspace monorepo using TypeScript. PlayQuest is a social media platform (SnapQuest-inspired but much more advanced) with a cyberpunk red/black/neon-blue aesthetic.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (api-server)
- **Database**: PostgreSQL + Drizzle ORM (available but not used by PlayQuest — uses localStorage)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + TailwindCSS v4 + Framer Motion

## PlayQuest App

Located at `artifacts/playquest/`. A full social media platform with:

### Pages
- `/login` — Login page with animated cyberpunk background
- `/register` — Register with avatar color picker
- `/feed` — Main feed with stories, posts, likes, comments, new post modal
- `/explore` — Trending hashtags, user discovery, post grid, search
- `/messages` — Direct messages with real-time conversation UI
- `/notifications` — Notifications with type icons (like, comment, follow, mention)
- `/profile/:username` — Profile with posts grid, follow/unfollow, stats
- `/settings` — Edit profile, notification prefs, privacy, logout

### Design System
- Colors: Jet black (#0a0a0f) + Neon Red (#e8102a) + Neon Blue (#00c8ff) + Electric Green (#39ff14)
- Fonts: Inter (body) + Space Grotesk (headings)
- Effects: Neon glows, glassmorphism cards, animated gradient backgrounds, framer-motion transitions
- Footer: ✦ 2026 PlayQuest by varnox•prime

### Data
All data stored in localStorage (no backend required):
- `pq_users`, `pq_posts`, `pq_stories`, `pq_comments`, `pq_likes`, `pq_follows`, `pq_notifications`, `pq_messages`
- Pre-seeded with 5 users, 10 posts, 4 stories, 5 notifications, 5 messages

### Demo Login
- Username: `alexvx` / Password: `demo`
- Or any of: `neonqueen`, `darkbyte`, `shadowfox`, `varnox` with password `demo`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
