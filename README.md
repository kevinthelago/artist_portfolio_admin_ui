# Artist Portfolio Admin UI

React admin dashboard for managing an artist portfolio. Allows editing artist profile fields, managing albums, adding/removing artwork pieces, and uploading images — all backed by a REST API.

## Setup

```bash
npm install
```

Configure `.env` with the backend URL and artist UUID:

```env
REACT_APP_PUBLIC_URL=https://your-backend.herokuapp.com
REACT_APP_ARTISTS_URL=${REACT_APP_PUBLIC_URL}/api/v1/artists/
REACT_APP_ALBUMS_URL=${REACT_APP_PUBLIC_URL}/api/v1/albums/
REACT_APP_PIECES_URL=${REACT_APP_PUBLIC_URL}/api/v1/pieces/
REACT_APP_IMAGES_URL=${REACT_APP_PUBLIC_URL}/api/v1/images/
REACT_APP_ARTIST_UUID=<artist-uuid>
```

## Development

```bash
npm start       # dev server at http://localhost:3000
npm run build   # production build → build/
npm test        # run tests
```

## Architecture

Manages a three-level portfolio hierarchy: **Artist → Albums → Pieces**. All state is held in `App.js` as a single nested `artist` object and passed down via props — there is no state management library.

The app produces two HTML pages: `admin.html` (the React SPA) and `login.html` (a redirect to Google OAuth2, handled by the backend).

Every field is inline-editable: click to edit, Enter or blur to save and persist via PUT.

## Backend

Pairs with a Spring Boot REST API. Authentication is handled by the backend via Spring Security + Google OAuth2. The `login.html` page redirects to `/oauth2/authorization/google`.
