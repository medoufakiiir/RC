# Vercel deployment (frontend only)

This project is a Vite + React SPA.

## Vercel project settings

In the Vercel UI, set:
- **Root Directory**: `website/app`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## Notes
- `vercel.json` includes a SPA rewrite rule so client-side routes like `/About` work correctly.
- This setup deploys only the frontend; no backend/database code from `website/backend` is involved.

