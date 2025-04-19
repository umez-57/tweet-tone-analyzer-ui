/**
 * Resolve the base‑URL that every fetch() in the app should use
 *
 *  • during local dev Vite injects the env‑var         VITE_API_BASE_URL
 *  • on production you can pass it via `--env` or your hosting UI
 *  • if it’s unset we automatically fall back to the local
 *    proxy prefix “/api”, which vite.config.ts already rewrites
 */
export const API_BASE =
  // ① env var defined?  use it (strip trailing “/” just in case)
  import.meta.env.VITE_API_BASE_URL?.toString().replace(/\/+$/, "") ||
  // ② otherwise default to   /api
  "/api";
