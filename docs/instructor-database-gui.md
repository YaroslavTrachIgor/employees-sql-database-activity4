# SQL database + GUI (for instructor demonstration)

This app uses **SQLite** via Prisma. With `DATABASE_URL="file:./dev.db"` in `.env`, the file is created at **`prisma/dev.db`** in the project (path is relative to the `prisma` directory).

## Option A: DB Browser for SQLite

1. Install [DB Browser for SQLite](https://sqlitebrowser.org/).
2. Open **Open Database** and select `prisma/dev.db` from this project.
3. Browse **Browse Data** → `User` to show tables and rows after login/seed.

## Option B: DBeaver

1. Install [DBeaver Community](https://dbeaver.io/).
2. New connection → **SQLite** → path to `prisma/dev.db`.
3. Use the ER diagram or SQL editor to show schema and queries.

## Option C: Prisma Studio (web UI)

From the project root:

```bash
npm run db:studio
```

Opens a browser UI for the same data defined in `prisma/schema.prisma`.

## Seeded demo users

After `npm run db:seed`:

- `manager1` / `manager123` (manager)
- `employee1` / `employee123` (employee)
