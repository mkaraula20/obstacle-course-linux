/**
 * Types for the `./routing` module, used by tsc (which resolves neither the
 * `.web.ts` nor the `.native.tsx` implementation). Both implementations expose
 * exactly this surface.
 */
export declare function useNavigate(): (to: string) => void;
export declare function useParams(): { itemId?: string };
