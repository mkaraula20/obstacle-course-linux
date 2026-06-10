/**
 * Types for the `./storage` module, used by tsc. Both the web (localStorage)
 * and native (AsyncStorage) implementations expose exactly this surface.
 */
export declare const storage: {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};
