# OTO Market Starter

This is a full **starter zip project** for a marketplace MVP built with **Next.js + TypeScript + Tailwind CSS**.

It is not a finished production marketplace yet, but it gives you a proper base with:

- homepage
- browse page
- sell page
- messages page
- dashboard page
- reusable components
- local API routes
- local JSON file storage for listings and messages

## What it does right now

- shows listings from `data/listings.json`
- lets you create new listings from `/sell`
- saves new listings to the local JSON file through `/api/listings`
- lets you submit enquiries from `/messages`
- saves enquiries to `data/messages.json`
- shows a basic owner dashboard

## What it does **not** do yet

- real user login
- real payment processing
- real booking calendar
- image file upload
- real-time messaging
- moderation/admin tools
- production database

## Run it

```bash
npm install
npm run dev
```

Then open:

```txt
http://localhost:3000
```

## Main folders

```txt
app/          pages and API routes
components/   reusable UI
lib/          types, constants, helpers, file-db
data/         local JSON storage
```

## Recommended next upgrades

1. Replace local JSON storage with Supabase
2. Add authentication
3. Add item detail pages
4. Add Stripe deposits/payments
5. Add image uploads
6. Add real-time chat

## Notes

This starter is designed so you can **actually run it immediately** after installing dependencies.


## Viewing individual items

Each listing card now links to its own page at `/listings/[id]`.

What was added:
- item detail page
- related listings section
- enquiry form directly on the item page
- API route for fetching a single listing
- 404 page for missing items
