# Activity 4 — Next.js + SQLite auth

Role-based GUI with login, idle logout, remembered user IDs, and manager-only account creation. Data lives in a local SQLite file via [Prisma](https://www.prisma.io/).

## Setup

1. Copy `.env.example` to `.env` and set `SESSION_SECRET` (at least 32 characters).
2. Install dependencies: `npm install`
3. Apply the schema and create the DB: `npx prisma migrate dev`
4. Seed demo users: `npm run db:seed`

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server at [http://localhost:3000](http://localhost:3000) |
| `npm run build` / `npm start` | Production build and run |
| `npm run db:seed` | Insert `manager1` and `employee1` (see seed output for passwords) |
| `npm run db:studio` | Prisma Studio (browser UI for table rows) |

## Demo logins (after seed)

- **Manager:** `manager1` / `manager123`
- **Employee:** `employee1` / `employee123`

## Instructor: viewing the DB in a GUI

See [docs/instructor-database-gui.md](docs/instructor-database-gui.md) (DB Browser, DBeaver, or Prisma Studio). The SQLite file is `prisma/dev.db`.
