# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # dev server on http://localhost:3000
npm run build    # production build → build/
npm test         # Jest in watch mode
npm test -- --watchAll=false   # run tests once (CI mode)
npm test -- --testPathPattern="App"  # run a single test file
```

## Environment

Copy `.env` and set values before running. Required vars:

| Variable | Purpose |
|---|---|
| `REACT_APP_PUBLIC_URL` | Backend base URL (e.g. `https://artistportfolio-78d96b03734f.herokuapp.com`) |
| `REACT_APP_ARTISTS_URL` | Derived from public URL — `/api/v1/artists/` |
| `REACT_APP_ALBUMS_URL` | Derived from public URL — `/api/v1/albums/` |
| `REACT_APP_PIECES_URL` | Derived from public URL — `/api/v1/pieces/` |
| `REACT_APP_IMAGES_URL` | Derived from public URL — `/api/v1/images/` |
| `REACT_APP_ARTIST_UUID` | UUID of the artist this admin instance manages |

The URL vars are derived from `REACT_APP_PUBLIC_URL` in `.env` using dotenv variable expansion, so only `REACT_APP_PUBLIC_URL` and `REACT_APP_ARTIST_UUID` need to be changed when switching environments.

## Architecture

### Data hierarchy

The app manages a single artist's portfolio with a three-level hierarchy:

```
Artist  (profile fields: email, about, links, image)
  └── Albums  (name, description, etc.)
        └── Pieces  (name, description, file/image, etc.)
```

All API state lives in `App.js` as a single `artist` object. Albums and pieces are nested within it. Every CRUD operation (`createAlbum`, `updateAlbum`, `deleteAlbum`, `createPiece`, etc.) is defined in `App.js` and passed down as props — there is no shared state library.

### Entry points

The webpack config produces two HTML pages:

- `public/admin.html` — mounts the React app (`src/index.js → App.js`)
- `public/login.html` — static page that redirects to `/oauth2/authorization/google` (handled by the backend's Spring Security OAuth2 config)

### Inline-edit pattern

Every field in the UI follows the same pattern:
- Click a field → it becomes an `<input>` (editable state tracked in `editingFields` object)
- Press Enter or blur → field reverts to read-only and the PUT endpoint is called
- `hiddenProperties` array controls which fields are hidden from the UI (e.g. `uuid`, `file`)

This pattern is duplicated across `App.js` (artist fields), `Album.jsx`, and `Piece.jsx` — each component owns its own `editingFields` state.

### Image uploads

Piece images are uploaded via `handleUploadImage` in `App.js`. The file is POSTed to `REACT_APP_IMAGES_URL/{artistUUID}/{filename}` with the raw file as the body. The piece's `file` property is updated locally and saved via `updatePiece`.

### CSS

Global CSS variables (spacing, colors, border-radius) are defined in `src/index.css`. `src/reset.css` is a basic CSS reset. Component-level styles are colocated (`album.css`, `piece.css`). Tailwind is installed but not heavily used — most styles are hand-written CSS.
