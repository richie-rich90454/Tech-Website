/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */

// GMaps (Google Maps plugin used in theme.ts)
declare class GMaps {
  constructor(opts: Record<string, any>);
  addMarker(opts: Record<string, any>): void;
}

// WOW.js (scroll animation library used in theme.ts)
declare class WOW {
  constructor(opts?: Record<string, any>);
  init(): void;
}

// particlesJS (used in particles app script)
declare function particlesJS(id: string, config: Record<string, any>): void;

