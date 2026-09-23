# RaviX Mobile

React/Vite storefront with an Express/MongoDB admin API. Customers browse, search, filter and sort products, then enquire/order through WhatsApp. Admins manage categories and products at `/admin`.

Product images are **direct HTTP/HTTPS URLs**. The database stores the URL only. There is no upload endpoint, image download, or server image storage. Existing branding assets remain bundled with the frontend.

## Local setup

Use Node.js 22.12+ and a running MongoDB instance.

1. Copy `backend/.env.example` to `backend/.env`. Set `MONGODB_URI`, a long random `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
2. Copy `frontend/.env.example` to `frontend/.env`. The development API URL defaults to `http://localhost:5001/api`; production defaults to `https://api.ravixmobile.com/api`.
3. Run `npm ci --prefix backend` and `npm ci --prefix frontend`.
4. In separate terminals, run `npm run dev --prefix backend` and `npm run dev --prefix frontend`.
5. Open the frontend URL, visit `/admin`, log in with the configured credentials, create a category, then add a product with a public direct image URL.

A link must point to the actual image, not a sharing page. URLs with query parameters are supported. Use HTTPS image links for an HTTPS storefront. The image host must allow external embedding. Edit existing products whose image values start with `/uploads/` to supply externally hosted URLs; old uploaded files are not automatically deleted or migrated.

## Configuration

Backend variables:

- `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET`: signing secret for admin sessions (one-day expiry).
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: admin credentials; no default login is provided.
- `PORT`: defaults to 5001.
- `ALLOWED_ORIGINS`: comma-separated frontend origins, without paths.

Frontend variables (set before building):

- `VITE_API_URL`: backend server origin, e.g. `https://api.ravixmobile.com`. The frontend adds `/api` automatically; legacy values already ending in `/api` remain supported.
- `VITE_WHATSAPP_NUMBER`: international number using digits only, default `94703280480`.

Contact-page/footer phone, email, location, and existing marketing/policy text are maintained in the corresponding React components. Confirm these business details before publishing.

## Checks

```sh
npm test --prefix backend
npm run lint --prefix frontend
npm run build --prefix frontend
```

Backend tests cover link validation, product create/edit/delete with mocked persistence, public search, admin authentication, health, CORS and HTTP error responses. Live Atlas smoke testing and browser workflow checks were also completed during setup; repeat the deployment health checks on your server.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for the complete Docker Compose server setup, domain configuration, HTTPS, and Atlas access steps.

Deploy `backend` as a Node service (`npm ci`, `npm start`) or use its Dockerfile. Supply backend variables in your host's secret/environment settings. Deploy `frontend/dist` after `npm run build --prefix frontend`; set the production API URL before building. Netlify SPA routing is included in `frontend/public/_redirects`. Other static hosts must rewrite frontend routes to `index.html`.

No persistent image disk or upload volume is required. `/api/health` confirms the process is running and `/api/ready` checks database connectivity; initial startup requires MongoDB connectivity. The app does not process payments or persist orders: order enquiries go directly to WhatsApp.

## Customer reviews and homepage hero

Visitors can submit a name, whole-star rating (1–5), and a comment on the homepage without an account. Reviews are published immediately and listed newest first with pagination. These are shop reviews, separate from the existing product ratings. Admins can delete reviews in `/admin`. Anonymous submissions have a basic per-process limit of five attempts per IP per 15 minutes; invalid attempts also count. Behind a reverse proxy, the default Express IP may be shared, so configure trusted proxies for your host before relying on per-visitor limits. Multi-instance deployments should use a shared rate limiter.

In `/admin`, **Homepage hero image** accepts a public direct HTTP/HTTPS image URL and shows a preview. Click **Save hero image** to persist it. **Use default**, followed by save, restores the bundled image. The homepage falls back to that default if settings are unavailable or the image fails to load. Only the URL is stored in MongoDB; images are never uploaded or downloaded by the backend.
