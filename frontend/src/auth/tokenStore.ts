// src/auth/tokenStore.ts — access token in localStorage for persistence across refreshes
/**
 * @deprecated
 * Token management is now handled by Firebase SDK.
 */
export const tokenStore = {
  get: () => localStorage.getItem('accessToken'),
  set: (t: string) => { localStorage.setItem('accessToken', t); },
  clear: () => { localStorage.removeItem('accessToken'); },
};
