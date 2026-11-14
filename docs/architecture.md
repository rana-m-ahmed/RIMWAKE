# RIMWAKE implementation

The package root is the repository root. Vite builds a React/TypeScript static application with CSS Modules and original SVG instruments. Fonts are local; the application does not depend on remote fonts, images or live astronomy calls.

`science/pipeline.py` archives source documents and Horizons responses, verifies returned target, Moon centre, east-positive geodetic coordinates, airless convention and MEAN_ME frame, and parses signed degree values between the response delimiters. It records exact request parameters, URLs, hashes and retrieval timestamps. A 35-day hourly discovery scan precedes a ten-minute refinement of the first crossing in processing order. A separately requested initial Sun sample at each site tests query/parse consistency.

`scripts/check_release.py` compares every released angle with its raw response, validates sources, query identity, sample order/cadence, the complete shared sample matrix and computed crossing brackets. It packages the evidence ZIP, sampled-state interval register and release manifest. Published scientific status remains provisional.

`src/science.ts` is the runtime Zod contract and the tested four-state visibility logic. The application first verifies release bytes against the manifest SHA-256, then validates identity and schema. The manifest detects inconsistent packaging; it is not a digital signature or a substitute for independent scientific review.

`src/App.tsx` owns one release, two selected sites, a sample index, hourly/refined mode, mobile A/B focus and the evidence drawer. Every diagram, numeric table, comparison and Loom is derived from that one selected timestamp. The diagrams plot only nonnegative elevations. Missing angles remain unknown. The timeline groups consecutive sampled states for efficient SVG rendering and never requests data while scrubbing. Event navigation filters to the chosen sites and sorts actual brackets chronologically.

The native modal has an accessible name, explicit keyboard focus wrapping that excludes closed-details content, Escape handling and focus restoration. Core data also exist as text tables. SVG text alternatives state exact angles and convention. Native sliders and previous/next controls provide keyboard access. Mobile displays one site at a time and retains the comparison; reduced motion removes transitions.

`tests/` exercises real browser journeys, failure/retry behavior, source links, evidence downloads, marker values, selected-site no-crossing behavior, mobile, reduced motion and axe accessibility audits. Test-only fault injection does not mutate the released scientific archive.

No terrain engine, database, account system, operational prediction, power model or RF model is present. No deployment or Git push has been performed under the latest owner instruction.
