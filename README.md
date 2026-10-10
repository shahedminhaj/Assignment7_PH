# বাজার দর (Bazar Dor)

বাজার দর is a responsive Bengali-language market price app for checking everyday
grocery prices, comparing market rates, and viewing product details.

## Features

- Browse current prices and daily price changes for essential products.
- Explore products by category and sort by price.
- View product details and market-by-market price summaries.
- Register and sign in with email/password, Google, or GitHub.
- Manage your profile and update your display name.
- Responsive Bengali UI with loading states and authentication notifications.
- Product data uses the Programming Hero API, retries through the alternative hosts, deduplicates simultaneous requests, and serves recent cached prices during upstream rate limits.

## Technologies

- Next.js App Router, React, and TypeScript
- Tailwind CSS
- Better Auth with MongoDB
- React Hot Toast
- Bazar Dor products API

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and fill in the required values.
3. Start the app with `npm run dev`.
4. Open [http://localhost:3000](http://localhost:3000).

### Product API configuration

The product proxy uses the Programming Hero Bazar Dor API by default, with the
original documented API hosts as fallbacks. If you have a
replacement API, set `PRODUCT_API_BASE_URL` to its origin (for example,
`https://api.example.com`) or its full `/api/bazardor` base URL. The proxy adds
`/api/bazardor` to an origin automatically and keeps the documented hosts as
fallbacks. Product detail lookups use the product ID from the product list;
the detail endpoint does not accept product slugs.

### Authentication configuration

Email/password sign-in uses the MongoDB database configured by `MONGODB_URI`.
Set `BETTER_AUTH_SECRET` to a private, randomly generated secret of at least 32
characters.
Google and GitHub sign-in are available when you provide OAuth credentials for
those providers. Each person deploying the app must create or use their own
Google OAuth client and GitHub OAuth app; OAuth client secrets cannot be shared
or safely built into the app.

Set `BETTER_AUTH_URL` to the app's origin (for example,
`http://localhost:3000` locally or your deployed HTTPS URL in production). The
auth client uses the current site origin, so a public client URL variable is
not required. Configure these callback URLs in your provider consoles:

- Google: `<app-origin>/api/auth/callback/google`
- GitHub: `<app-origin>/api/auth/callback/github`

For example, with a local app the callback URLs are
`http://localhost:3000/api/auth/callback/google` and
`http://localhost:3000/api/auth/callback/github`. Use your deployed HTTPS
origin instead when deploying, and add the values from `.env.example` to your
deployment provider's environment-variable settings. Leave a provider's
credentials empty if you do not want to enable that provider.

## Scripts

- `npm run dev` — start the development server.
- `npm run lint` — run ESLint.
- `npm run build` — create a production build.
