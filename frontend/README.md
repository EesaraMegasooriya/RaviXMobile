# RaviX Mobile frontend

## Netlify deployment

The root `netlify.toml` configures:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist` (relative to `frontend`)
- Node.js: 22
- `VITE_API_URL=https://api.ravixmobile.com`

The shared API helper adds `/api`, so product requests go to `https://api.ravixmobile.com/api/products`. Admin, category, review, and hero-setting requests use the same helper. Existing values ending in `/api` are also supported without duplicating the prefix.

Redeploy after changing Vite environment variables because they are embedded at build time. SPA routing is handled by `public/_redirects`, including direct visits to `/admin`, `/shop`, and `/categories`.

For a manual Netlify upload, build from the project root:

```sh
VITE_API_URL=https://api.ravixmobile.com npm run build --prefix frontend
```

Upload the contents of `frontend/dist` to Netlify. Do not upload the source folder or backend environment file.

The hosted backend must keep:

```dotenv
ALLOWED_ORIGINS=https://ravixmobile.com,https://www.ravixmobile.com
```

Preview domains are not in that allowlist; use the configured production domains to verify API access after deployment.

## Local development

```sh
npm ci
npm run dev
npm run lint
npm run build
```

Development defaults to `http://localhost:5001/api` when `VITE_API_URL` is unset. To use the hosted API, set `VITE_API_URL` in a local `.env`; its backend must allow your local origin.
