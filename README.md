# SalonBook – Client

SalonBook is a salon appointment booking platform. Customers explore salon services, request appointments and pay for confirmed appointments with Stripe. The salon admin manages services, appointments, customers and payments.

**Live Website:** `https://your-client-url.vercel.app`
**Client Repository:** `https://github.com/your-username/salonbook-client`
**Server Repository:** `https://github.com/your-username/salonbook-server`

## Important Features

- Home page with banner, featured services, service categories, "How it works" and FAQ sections
- Browse services with **search by name**, **category filter** and **sort by price**
- Protected service details page + appointment booking form (date, time slot, message)
- Better Auth: email/password + Google login, role based redirects, blocked-user protection
- Customer dashboard: overview stats, my appointments (view, cancel pending, pay confirmed), payment history, profile
- Admin dashboard: overview, manage services (add / update / delete / activate), manage appointments, manage users (block / unblock), transactions, profile
- Stripe Checkout; payment status is updated **only** by a verified Stripe webhook (on the server)
- Image upload through the server to ImgBB (the API key never reaches the browser)
- Toast notifications, loading states, error states, confirmation dialogs, fully responsive design

## Technology Stack

Next.js (App Router) · React · Tailwind CSS v4 · Better Auth (+ JWT plugin) · MongoDB · react-hot-toast · react-icons

## Installation Instructions

```bash
git clone https://github.com/your-username/salonbook-client.git
cd salonbook-client
npm install
cp .env.example .env     # then fill in the values
```

## How to Run the Project Locally

1. Start the **server** first (see the server README).
2. In this folder run `npm run dev`
3. Open http://localhost:3000

Create the admin account:
1. Sign up on the website with the email you put in the server's `ADMIN_EMAIL`.
2. In the server folder run `npm run make-admin`.
3. Sign out and sign in again, you will land on the Admin Dashboard.

(Optional) Add demo services: `npm run seed` in the server folder.

## Required Environment Variables (names only)

```
BETTER_AUTH_URL
BETTER_AUTH_SECRET
MONGODB_URI
DB_NAME
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_API_URL
```

Notes
- `BETTER_AUTH_URL` must be exactly the same value as `CLIENT_URL` in the server (no trailing slash).
- Google OAuth redirect URI to add in Google Cloud Console: `<BETTER_AUTH_URL>/api/auth/callback/google`
- Never commit your `.env` file.

## How authentication works (short)

1. Better Auth logs the user in and creates a session cookie.
2. The client asks `/api/auth/token` for a short-lived **JWT** and sends it to the Express server as `Authorization: Bearer <token>`.
3. The server verifies the JWT with Better Auth's public keys (`/api/auth/jwks`) and loads the user's **role** and **blocked status from MongoDB** on every request.

## Deployment (Vercel)

Add all the environment variables above in the Vercel project settings, deploy, then update `CLIENT_URL` on the server to the live client URL and add the live URL to the Google OAuth settings.
