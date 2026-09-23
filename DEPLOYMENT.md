# Deploy RaviXMobile

## Current setup: Netlify frontend + hosted API

The backend is hosted at `https://api.ravixmobile.com`. Deploy the frontend using the root `netlify.toml`, which sets `VITE_API_URL=https://api.ravixmobile.com`, builds `frontend`, and publishes `frontend/dist`. The shared frontend API helper adds `/api` to requests. See [frontend deployment steps](frontend/README.md#netlify-deployment).

Keep the hosted backend environment set to `ALLOWED_ORIGINS=https://ravixmobile.com,https://www.ravixmobile.com`. Deploy previews require their own allowed origin if you want them to access the API. If those origins are not already active on the hosted backend, update its environment and restart it. The deployed API was confirmed to return HTTP 403 for the production origins. The backend source now always allows both production domains, with extra origins accepted from the environment. Deploy this backend change and recreate/restart the running service; a frontend redeploy alone cannot change API CORS.

## Alternative: self-host both services with Docker

The following instructions are for hosting both the frontend and backend on one server. They are not needed for the current Netlify frontend.

The app uses MongoDB Atlas. MySQL is not required. Products, categories, customer reviews, and homepage hero settings persist in MongoDB; image URLs are stored as text. Orders go to WhatsApp.

## Requirements

- A Linux server with Docker Engine and Docker Compose v2.
- Your domain's DNS A record pointing at the server (and a correct AAAA record if you use IPv6).
- TCP ports 80 and 443 open and available for this app. UDP 443 is optional for HTTP/3.
- Atlas network access allowing your server's outbound IP, and a database user with read/write permissions for `ravixmobile`.

## Configure

Copy the project to the server without local `node_modules`, build folders or `.env` files. Keep secrets out of Git and container images.

From the project root:

```sh
cp .env.example .env
cp backend/.env.example backend/.env
chmod 600 backend/.env
```

Edit the root `.env`:

```dotenv
SITE_ADDRESS=shop.example.com
SITE_ORIGIN=https://shop.example.com
VITE_WHATSAPP_NUMBER=94703280480
```

Use your real domain in both settings. Set `SITE_ADDRESS=:80` and `SITE_ORIGIN=http://YOUR_SERVER_IP` for an initial HTTP-only IP test. Use HTTPS for the live admin panel.

Edit `backend/.env`:

```dotenv
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/ravixmobile?appName=Cluster0
JWT_SECRET=YOUR_RANDOM_SECRET
ADMIN_EMAIL=YOUR_ADMIN_EMAIL
ADMIN_PASSWORD=YOUR_STRONG_ADMIN_PASSWORD
```

Percent-encode special characters in the database username/password. The database URL in the local project is already configured, but rotate the password shared in chat before using it on your public server. Update the local/server `.env` after rotation. The admin credentials are separate from the database credentials.

Generate a JWT secret with `openssl rand -hex 48`. Compose supplies the port, production mode, allowed origin, and one trusted reverse proxy automatically. The backend port is not exposed publicly.

## Start

```sh
docker compose config --quiet
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 backend web
```

Visit `https://YOUR_DOMAIN` and `https://YOUR_DOMAIN/admin`. Caddy serves the SPA and proxies `/api/*` to the backend. For a public domain with correct DNS and reachable ports, Caddy provisions and renews TLS certificates automatically; see [Caddy's HTTPS requirements](https://caddyserver.com/docs/automatic-https).

Verify:

```sh
curl --fail https://YOUR_DOMAIN/api/health
curl --fail https://YOUR_DOMAIN/api/ready
```

`health` checks the process; `ready` verifies MongoDB connectivity. The web container waits for a healthy backend on startup. If startup fails, check the four required backend variables, Atlas IP access, database credentials, and domain/port configuration.

## Set up the shop

1. Log in at `/admin` with `ADMIN_EMAIL` and `ADMIN_PASSWORD` from the server's `backend/.env`.
2. Create categories and products. Product images use public direct HTTPS image links.
3. Paste the homepage hero image link and click **Save hero image**. **Use default** followed by save restores the bundled image.
4. Open the shop to check product search, filters and WhatsApp order links.
5. Customer reviews publish immediately on the homepage; admins can delete spam.

The database starts empty unless you already added records. Existing MongoDB data in other databases is not migrated automatically. Replace old `/uploads/...` product image paths with external image links.

## Update, stop and back up

After copying new code, run `docker compose up -d --build` again. Use `docker compose down` to stop the containers. Keep the Caddy volumes to retain certificate state. Shop data lives in Atlas; configure backups there and retain a secure copy of your server environment settings.

The built-in login/review rate limits are per backend process. This configuration runs one backend behind one trusted proxy. A multi-replica deployment should use a shared rate limiter and appropriately configured proxy trust.

## Validation commands

```sh
npm ci --prefix backend
npm ci --prefix frontend
npm test --prefix backend
npm run lint --prefix frontend
npm run build --prefix frontend
cd backend
npm run db:check
npm run test:live
```

`test:live` creates a short-named temporary database on the configured cluster and removes it afterward; it needs permission to create/drop that temporary database. It does not write fixtures to the shop database. Ordinary `npm test` uses mocked persistence and does not contact Atlas.

The live Atlas API smoke test and browser checks were run during setup. Docker Compose configuration was validated, but container build/start was not run locally because Docker Engine was not running. Run the start and health checks above on your server.

## Deploy the discount / availability / reply update

Deploy the backend first, then redeploy the Netlify frontend. These changes add optional fields to existing MongoDB documents; no manual migration is required. Existing products continue to work with no sale price, an empty description, and in-stock availability. Existing reviews display without replies until an admin posts one.

New API support:

- Product create/update: optional `salePrice` (number or null), `availability` (`in_stock`, `out_of_stock`, `pre_order`), and `description` (up to 3000 characters).
- `GET /api/products/:id`: visible product details; hidden/missing products return 404.
- `PUT /api/admin/reviews/:id/reply`: authenticated admin submits `{ "reply": "Thank you!" }` (1–2000 characters).
- `DELETE /api/admin/reviews/:id/reply`: authenticated admin removes the reply.

After deploying, edit a product to add a discount and availability, open its product page, verify the WhatsApp message without sending a test enquiry, then post and edit an admin reply. The existing Netlify SPA rewrite covers `/products/:id` links.
