# Shipyard

A small, original product-launch board built as a practice target for
[REA](https://github.com/edoygun/rea). All products, makers and comments are fictional.

## Run it

```sh
npm install
npm run dev      # API on :3001 + Vite dev server on :5173
# or
npm run build && npm start   # everything on http://localhost:3001
```

Data lives in `server/data/db.json`, created from `server/seed.js` on first run.
Delete `server/data/` to reset. Sign-in is demo-only: any handle, no password.

## API

| Method | Path                            | Notes                         |
| ------ | ------------------------------- | ----------------------------- |
| GET    | `/api/session`                  | Current user or `null`        |
| POST   | `/api/session`                  | `{ handle, name }`, sets cookie |
| DELETE | `/api/session`                  | Sign out                      |
| GET    | `/api/topics`                   | Topics with launch counts     |
| GET    | `/api/launches?topic=&q=`       | Newest first                  |
| POST   | `/api/launches`                 | Auth. `{ name, tagline, description, url, topics }` |
| GET    | `/api/launches/:slug`           | Launch plus comments          |
| POST   | `/api/launches/:slug/vote`      | Auth. Toggles your boost      |
| POST   | `/api/launches/:slug/comments`  | Auth. `{ body }`              |
| GET    | `/api/makers/:handle`           | Profile, launches, boosted    |

Production builds include source maps (`dist/assets/*.js.map`) so REA can map
bundled code back to `src/`.
