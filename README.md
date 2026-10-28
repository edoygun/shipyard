# ⛵ Shipyard

Shipyard is a small product-launch board: makers post what they've built, and
the community boosts and discusses the day's launches.

It was built as a hands-on practice target for
[REA (Reverse Engineer Anything)](https://github.com/edoygun/rea). Because you
own the app and its source, you can try REA's website-analysis tools on it and
check every result against the real code. All products, makers and comments in
the seed data are fictional.

## Features

- **Daily feed**: launches grouped by day, sorted by *Most boosted* or *Newest*
- **Topics and search**: filter by topic from the sidebar, or search by name and tagline
- **Boosts**: upvote launches (toggle on and off)
- **Discussion**: comment threads on every launch page
- **Launch something**: submit your own product with topics and a link
- **Maker profiles**: each maker's launches and the launches they've boosted
- **Demo sign-in**: pick any handle, no password, nothing leaves your machine
- **Light and dark themes**: follows your system setting

## Tech stack

| Layer    | Tools                                              |
| -------- | -------------------------------------------------- |
| Frontend | React 18, React Router 6, Vite 5, plain CSS        |
| Backend  | Node.js, Express 4                                 |
| Storage  | A JSON file (`server/data/db.json`)                |

## Getting started

You need [Node.js](https://nodejs.org/) 18 or newer.

```sh
git clone https://github.com/edoygun/shipyard.git
cd shipyard
npm install
```

**Development** (hot reload):

```sh
npm run dev
```

This runs the API on http://localhost:3001 and the Vite dev server on
http://localhost:5173. Open the Vite URL; it forwards `/api` requests to the API.

**Production build**:

```sh
npm run build
npm start
```

Everything is then served from http://localhost:3001.

### Resetting data

On first run, `server/data/db.json` is created from `server/seed.js`. Your
boosts, comments and launches are saved there. Delete the `server/data/` folder
and restart the server to get the original seed data back.

## Project structure

```
├── index.html             Vite entry page
├── vite.config.js         Dev proxy and source-map settings
├── server/
│   ├── index.js           Express app and all API routes
│   ├── db.js              Load and save the JSON database
│   └── seed.js            Fictional starter data
└── src/
    ├── main.jsx           App bootstrap (router + session)
    ├── App.jsx            Route table
    ├── api.js             Fetch wrapper for every endpoint
    ├── session.jsx        Signed-in user context
    ├── styles.css         All styles and theme colors
    ├── components/        Header, LaunchCard, LaunchTile, VoteButton
    └── pages/             Home, Launch, Maker, Submit, SignIn
```

## API

All responses are JSON. Endpoints marked **auth** need the `sy_user` cookie set
by `POST /api/session`.

| Method | Path                           | Description                                       |
| ------ | ------------------------------ | ------------------------------------------------- |
| GET    | `/api/session`                 | Current user, or `null`                           |
| POST   | `/api/session`                 | Sign in with `{ handle, name }`                   |
| DELETE | `/api/session`                 | Sign out                                          |
| GET    | `/api/topics`                  | All topics with launch counts                     |
| GET    | `/api/launches?topic=&q=`      | Launches, newest first, optionally filtered       |
| POST   | `/api/launches`                | **auth** Create `{ name, tagline, description, url, topics }` |
| GET    | `/api/launches/:slug`          | One launch with its comments                      |
| POST   | `/api/launches/:slug/vote`     | **auth** Toggle your boost                        |
| POST   | `/api/launches/:slug/comments` | **auth** Add `{ body }`                           |
| GET    | `/api/makers/:handle`          | Profile, launches and boosted launches            |

Example:

```sh
curl -c cookies.txt -H "Content-Type: application/json" \
  -d '{"handle":"nadia"}' http://localhost:3001/api/session
curl -b cookies.txt -X POST http://localhost:3001/api/launches/tidepool/vote
```

## Practicing with REA

Production builds include source maps (`dist/assets/*.js.map`), so REA can map
the minified bundle back to the files in `src/`. A typical session:

1. `npm run build && npm start`
2. Start Chrome with remote debugging: `chrome --remote-debugging-port=9222`
3. Open http://localhost:3001 in that browser.
4. Use REA's browser tools: `rea list-browser-targets`, `rea inspect-web-page`,
   `rea observe-web-execution`, `rea export-web-scripts`, then
   `rea analyze-javascript-application` on the exported scripts.
5. Compare what REA found (routes, API endpoints, modules) with this README
   and the source.

See REA's [browser observation guide](https://github.com/edoygun/rea/blob/main/docs/browser-observation.md)
for details.

## Security note

Sign-in is for demonstration only. Anyone can act as any handle by setting a
cookie. Don't deploy Shipyard on a public server as-is.
