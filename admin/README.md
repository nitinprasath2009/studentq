# studentq-admin

School admin console for StudentQ, a classroom student-response system. It is a React + Vite + TypeScript app.

## Layout

- `apps/admin` is the admin console app.
- `libs/console-ui` holds the shared shell, tabs, styles and fixture data.
- `libs/domain` holds the shared domain types.

The libraries are npm workspaces, so one install at the root links everything.

## Run it

```
npm install
npm run dev        # Vite dev server on http://localhost:5175
npm run build      # production build into apps/admin/dist
npm run typecheck  # tsc over the apps and libs
```

## Status

This is an early prototype. The console runs entirely on fixture data from `libs/console-ui/src/fixtures.ts`. There is no backend, and the login screen accepts any non-empty password.
