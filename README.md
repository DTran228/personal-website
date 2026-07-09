# Personal Website — Duc Tran

Full-stack personal website: **React + Vite + TypeScript** frontend, **Express + TypeScript** backend (SQLite coming later).

## Structure

```
client/   → frontend (what visitors see) — runs at http://localhost:5173
server/   → backend API — runs at http://localhost:3001
```

During development, Vite proxies any `/api/*` request from the frontend to the backend (see `client/vite.config.ts`).

## First-time setup

Install dependencies in **both** folders (only needed once, and again whenever package.json changes):

```
cd client
npm install
cd ../server
npm install
```

## Running the site (two terminals)

Terminal 1 — backend:

```
cd server
npm run dev
```

Terminal 2 — frontend:

```
cd client
npm run dev
```

Then open http://localhost:5173. The Home page shows "Backend says: ok — backend is running!" when both halves are connected.

## Roadmap

- [x] Project skeleton: Home page + Navbar + health endpoint
- [ ] Education page
- [ ] Projects page
- [ ] Experience page
- [ ] Coding page (GitHub + LeetCode stats)
- [ ] Footer: interests, contact form (email + notes → SQLite), contact info
- [ ] Styling / design pass
- [ ] Deployment
