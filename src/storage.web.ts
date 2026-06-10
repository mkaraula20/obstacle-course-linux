/**
 * Web persistence — async wrapper over localStorage. Resolved by Vite (its
 * resolve.extensions lists `.web.ts` before `.ts`). Metro resolves
 * `storage.native.ts`; tsc resolves `storage.d.ts`. No plain `storage.ts`
 * (see routing.web.ts for why).
 */
export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};
