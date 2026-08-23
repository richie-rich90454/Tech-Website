// Polyfills for Chrome 49+ / Firefox 45+ / Safari 10+ (ES2015-era) browsers.
// Imported first in the root layout so missing runtime APIs are shimmed
// before any application code runs.
import 'core-js/stable';
import 'regenerator-runtime/runtime';
