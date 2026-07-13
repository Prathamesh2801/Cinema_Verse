# CinemaVerse — Project Reference

A movie & TV discovery app (Netflix-style) powered by the **TMDB API**, with user
auth, bookmarks, and nested reviews. The README/repo also call it **Stream-Verse**;
the working folder is `CinemaVerse`. Same project.

## Tech Stack

| Layer    | Stack |
|----------|-------|
| Client   | React 19 + Vite 8 + React Router 7 + Tailwind 3, Framer Motion, react-hot-toast, lucide-react / react-icons, axios |
| Server   | Node + Express 5 (ESM), Mongoose 9, JWT (jsonwebtoken), bcrypt, axios |
| Database | MongoDB Atlas |
| External | TMDB API (all media data proxied through the server) |
| Deploy   | Client → Vercel (SPA rewrites in `client/vercel.json`). Server → separate host, listens on `0.0.0.0`. |

## Repo Layout

```
CinemaVerse/
├── client/          # React SPA (Vite)
├── server/          # Express API (proxies TMDB + owns Mongo data)
├── *lighthouse_report*.json   # perf audits (desktop + mobile), gitignore candidates
└── README.md
```

The `client` and `server` are independent npm packages — **no root package.json**.
Run each separately.

## Run / Build

```bash
# Server  (port from .env, else 3000)
cd server && npm install && npm run dev      # nodemon server.js   (start = node server.js)

# Client  (Vite dev server, --host exposes on LAN)
cd client && npm install && npm run dev      # build: npm run build → dist/
```

### Env vars
- **server/.env** (gitignored): `PORT`, `MONGO_URI`, `JWT_SECRET`, `TMDB_API_KEY`, `TMDB_BASE_URL` (e.g. `https://api.themoviedb.org/3`)
- **client/.env.development** & **client/.env.production** (gitignored): `VITE_API_BASE_URL` — the server origin **without** `/api` (client appends `/api`, see `client/src/app/config.js`).

## Server Architecture

Modular, layered pattern. Each domain in `server/modules/<name>/` has:
`*.routes.js` → `*.controller.js` → `*.service.js` (+ `.model.js`, `.validation.js`, `.helper.js` where relevant).

- `server.js` — boots dotenv, connects DB, `app.listen`.
- `app.js` — Express app, CORS (open), JSON parsing, mounts routers under `/api/*`.
- `config/db.js` — Mongoose connect. `config/tmdbClient.js` — axios instance preloaded with TMDB base URL + api_key, 10s timeout.
- `middleware/authMiddleware.js` — reads `Authorization: Bearer <token>`, verifies JWT, sets `req.user` (`{ id }`).
- `utils/moderation/filterMediaContent.js` — quality gate applied to **all** TMDB lists (min vote count/avg, require poster, drop adult, drop low-vote JP anime).

### API Endpoints (all under `/api`)

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/movies/popular` `/movies/top-rated` `/movies/latest` | — | returns **bare array** of results |
| GET | `/movies/:id` | — | full TMDB detail object |
| GET | `/tv/popular` `/tv/top-rated` `/tv/airing-today` | — | bare array |
| GET | `/tv/:id` | — | full detail object |
| GET | `/search?query=` | — | multi-search, people filtered out |
| POST | `/auth/register` `/auth/login` | — | → `{ token, user }` |
| GET | `/review/:mediaId` | optional | → `{ success, data }` (flat list; `isLiked/isDisliked` set if token) |
| POST/PUT/DELETE | `/review` `/review/:id` | ✅ | create/update/delete (delete cascades replies) |
| POST | `/review/:id/like` `/review/:id/dislike` | ✅ | mutually exclusive; can't vote own |
| POST | `/review/reply` | ✅ | `{ review, parentId }` |
| POST | `/bookmark/toggle` | ✅ | `{ mediaId, mediaType }` |
| GET | `/bookmark` | ✅ | user's bookmarks |
| GET | `/bookmark/:mediaId` | ✅ | boolean-ish |

⚠️ **Response-shape inconsistency:** movie/tv list endpoints return a **raw array**;
detail endpoints return a raw object; review/bookmark endpoints wrap in
`{ success, data }`. Client code handles each shape explicitly (e.g. `res.data.data`
for reviews). Keep this in mind when adding endpoints — there's no global envelope.

### Data Models (Mongoose)
- **User** — `username` (unique, lowercase), `password` (bcrypt, `select:false`).
- **Review** — `userId`, `mediaId` (Number = TMDB id), `rating`, `review`, `likes[]`, `dislikes[]`, `parentId` (self-ref → replies form a tree). Server stores `review`, but `normalizeReview` exposes it to client as `comment`.
- **Bookmark** — `userId`, `mediaId` (Number), `mediaType` (`"movie"|"tv"`); unique compound index on all three.

## Client Architecture

**Feature-first** structure under `client/src/features/<feature>/` with
`api / components / pages / context / hooks / utils / config` subfolders as needed.

- `main.jsx` → `App.jsx` wraps `AuthProvider` → `BookmarkProvider` → `RouterProvider`.
- `routes/router.jsx` — all routes under `MainLayout` (Header + Outlet + Footer + Toaster). `/bookmarks` wrapped in `ProtectedRoute`.
- `services/api.js` — shared axios instance, `baseURL = VITE_API_BASE_URL + /api`.
- Design system: **CSS custom properties** in `index.css` (dark bg `#09090b`, **gold** `#EECD81` accent, royal blue complement, radius scale). Components are styled with **inline `style` objects** referencing `var(--color-*)` — not utility classes for most layout. Match this idiom when editing.

### Routes
`/` Home · `/:type/:id` Detail (type = `movie|tv`) · `/movies` · `/tv` · `/login` · `/register` · `/bookmarks` (protected)

### State (React Context, no Redux)
- **AuthContext** — `user`, `token`, `login()`, `logout()`, `loading`. Persists to `localStorage` (`user`, `token`). Rehydrates on mount.
- **BookmarkContext** — `bookmarks[]`, `toggle(item)`. Optimistic local update + server toggle. Refetches when `token` changes.

### Key client data flow
- **Media APIs** (`features/movies/movie.api.js`, `features/tv/tv.api.js`) hit the server, tag each item with `media_type`.
- **`features/media/api/media.api.js`** — composes homepage "rows" client-side: fetches popular movies+TV, then sorts/filters into curated sections (Trending, Critically Acclaimed, Discover, Dark & Intense, Sci-Fi, Animated, Hidden Gems). Genre constants + `hasGenre`/`isAnime` helpers live here.
- **`features/media/config/homepageSections.js`** — declarative list of `{ id, title, fetcher }`; `useHomepageMedia` hook drives the homepage (hero carousel rotates every 10s from trending+topRated; rows lazy-load after hero).
- **`utils/normalizeMedia.js`** — flattens TMDB movie/tv shape into a common `{ id, mediaType, title, poster, backdrop, rating, year, genres, raw }`.
- **`utils/image.js`** — builds TMDB image URLs (`getImageUrl(path, size)`), fallback `/fallback.jpg`.
- **Reviews** — flat list from API; `features/review/utils/buildTree.js` (`buildReviewTree`) nests by `parentId` for rendering in `ReviewSection`.

## Conventions & Gotchas
- **ESM everywhere** (`"type": "module"` in both packages). Use `import`/`export`.
- Emoji-decorated section-comment banners are the house style in server services/controllers.
- `mediaId` is always the **TMDB numeric id** (not a Mongo id) across reviews/bookmarks.
- **Legacy deps in `server/package.json`** (`mysql2`, `ejs`, `express-session`, `method-override`) are leftovers from a pre-Mongo/pre-API iteration — unused. Package name is still `"1_draft"`.
- `isBookmarkedService` matches on `mediaId` only (ignores `mediaType`) — minor latent bug if the same id exists as both movie & tv.
- No test suite, no linter config on server. Client has ESLint (`npm run lint`).
- Recent work (git log) has focused on the **client UI rebuild, homepage, and perf/SEO** (see lighthouse reports). Server API is comparatively stable.

## Current State (as of 2026-07-13)
- Home, Detail, Movies, TV, Auth, Bookmarks, nested Reviews all implemented and wired end-to-end.
- Working tree: `client/src/features/media/components/MediaCard.jsx` modified (2 lines removed).
- Latest commits: perf/SEO optimization → Home page → UI reconstruction → content moderation.
