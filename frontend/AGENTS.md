<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Frontend Scope Addendum

Read workspace instructions first: [../AGENTS.md](../AGENTS.md).

This file only adds frontend-local context:
- Primary app entry points are [app/layout.tsx](app/layout.tsx) and [app/page.tsx](app/page.tsx).
- Shared auth state lives in [src/context/AuthContext.tsx](src/context/AuthContext.tsx).
- Frontend scripts and versions are in [package.json](package.json).
