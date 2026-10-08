## Sustainability

We treated performance as a sustainability concern, not just a UX one: every kilobyte shipped to a browser has a real energy cost, on the user's device and across the network it travels. We measured this with Lighthouse and the Green Web Foundation's [CO2.js](https://www.npmjs.com/package/@tgwf/co2) library.

### Lighthouse audit

Run against the production build, desktop emulation:

| Category | Score |
|---|---|
| Performance | 99 |
| Accessibility | 79 |
| Best Practices | 100 |
| SEO | 82 |

**Core metrics:**

| Metric | Value |
|---|---|
| First Contentful Paint | 0.8 s |
| Largest Contentful Paint | 0.9 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 0.8 s |

### Estimated carbon footprint

Lighthouse's own network panel measured **615 kB transferred** across 9 requests for a full page load. We fed that figure into CO2.js, which implements the same methodology used by public carbon calculators (e.g. websitecarbon.com), to estimate emissions per visit:

```js
import { co2 } from "@tgwf/co2";

const emissions = new co2();
const result = emissions.perVisit(615000); // bytes transferred, measured via DevTools
// → 0.091143 g CO2 per page view
```

**Result: ~0.091 g CO2 per page view.**

For context, the average web page (per the HTTP Archive / Website Carbon's own baseline) emits roughly 0.5–1 g CO2 per visit, so this page sits meaningfully below average, largely a product of the minimal design (no hero images, no video, system-rendered icons via `lucide-react` rather than image assets) rather than any sustainability-specific optimization.

### Known improvement we identified but have not yet shipped

Lighthouse's diagnostics flagged **335 KiB of unused JavaScript** in a single chunk, which is likely explained by a mismatch in how the frontend is served: our `start` script currently runs the Bun dev entrypoint directly in production (`NODE_ENV=production bun src/index.ts`) rather than serving the minified, tree-shaken output our `build` script already produces in `./dist`. We've identified the fix — point the production server at the built output instead of raw source — but did not have time to validate and re-measure before submission. Closing this gap would reduce the 615 kB baseline above further, and we'd expect the CO2-per-visit estimate to drop accordingly, since the two numbers are directly linked (less JavaScript transferred → less estimated energy per page load).

### Other scores, briefly

- **Accessibility (79):** our two remaining flags are icon-only buttons (search, login, account menu) missing `aria-label`s, and the page lacking a `<main>` landmark — both are small, identified fixes we didn't get to.
- **SEO (82):** missing a meta description and an invalid `robots.txt`; neither affects a course-project demo, but both are easy, known fixes.
- **Best Practices (100):** no outstanding issues.
