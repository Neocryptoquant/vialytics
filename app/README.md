Frontend notes — enrichment and UI
=================================

The frontend (`app/`) now consumes server-side enrichment from Helius/Orb and prefers normalized fields when available.

Key behavior
- The dashboard fetches `/api/analytics/{wallet}` from the backend.
- If the response includes `external_sources.helius_orb.normalized`, the frontend will prefer those fields for:
  - Active Assets (`normalized.token_balances`) — used to populate the assets pie chart.
  - Top Income Sources (`normalized.top_counterparties`) — shows friendly labels when available.
  - Top Spending (`normalized.top_spending_categories`).

Accessibility & UX
- Addresses are shown as friendly labels when known; otherwise shortened (e.g. `2QkJ...RGSR`) and link to Orb.
- A small "What is this?" button opens a modal with an explanation and link to Orb for more details.
- Activity chart includes a hover tooltip and vertical crosshair for clarity.

Deployment
- The `vialytics.xyz` domain will be used for production deployment (DNS and hosting details to be added later).
# bun-react-tailwind-shadcn-template

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

This project was created using `bun init` in bun v1.3.3. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
