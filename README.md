# Aireo — frontend portfolio concept

A static, frontend-only airline experience with a custom Three.js aircraft, original brand and cabin imagery, responsive layouts, and a complete simulated booking journey.

## Preview

Run `npm start` and open http://localhost:3000. Node only serves static files for development; it is not an application backend. Or serve `dist/` with any static hosting provider. No build step, API, database, secret, or account is required.

## Features

- Interactive 3D aircraft with three fleet-view camera presets, drag rotation, pause control, reduced-motion support, and rendering suspended off screen.
- One-way / return search, 10 airports, three cabins, 1–6 guests, seat selection, review and confirmation.
- Browser-local saved journeys, reference lookup, demo check-in, printable boarding pass, itinerary download, cancellation, and demo reset.
- Cabin switching with distinct images, destination shortcuts, Circle membership, enquiry form, USD / SAR preference.

All transactions are simulations. Browser storage is scoped to the current origin and browser. No data is sent to an airline. Use fictional details. Browser storage can be cleared using Privacy → Reset browser demo.

## Validation

`npm run check` checks JavaScript syntax. `npm test` tests route/date validation, unique schedules, multiple guests, return and one-way reservations, seat validation, storage, lookup, check-in, cancellation, membership and storage-error handling.

## Assets

The logo, sky and three cabin visuals were generated using built-in OpenAI image generation. Optimized deliverables are in `dist/assets/`. `ASSETS.md` contains prompts and attribution. Third-party destination photos retain their attribution in the website's Credits panel.

The old backend is removed. The existing `.data/` folder, if present, is a legacy local file and is not read, served or used by this frontend.
