/**
 * Web routing — thin re-export of react-router-dom. Resolved by Vite (its
 * resolve.extensions lists `.web.ts` before `.ts`). Metro resolves
 * `routing.native.tsx` on ios/android; tsc resolves `routing.d.ts`.
 *
 * There is intentionally NO plain `routing.ts`: Metro does not reliably prefer a
 * `.native` sibling over a plain `.ts` for extensionless imports, so a plain
 * file would leak react-router-dom into the native bundle.
 */
export { useNavigate, useParams } from "react-router-dom";
