/** Site-wide branding. Change these in one place. */
export const SITE_NAME = 'Babamosie Resume Maker';

/**
 * Public URL of the deployed site (used for canonical links, sitemap and
 * social previews). Override at build time with VITE_SITE_URL.
 */
export const SITE_URL: string =
  (typeof import.meta !== 'undefined' &&
    (import.meta as any).env &&
    (import.meta as any).env.VITE_SITE_URL) ||
  'https://babamosie-resume-maker.vikramsingh14052006.workers.dev';
