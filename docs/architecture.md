# RIMWAKE implementation

The package root is the repository root. Vite builds a React/TypeScript static application with CSS Modules and original SVG instruments. Fonts are local; the application does not depend on remote fonts, images or live astronomy calls.

`science/pipeline.py` archives source documents and Horizons responses, verifies returned target, Moon centre, east-positive geodetic coordinates, airless convention and MEAN_ME frame, and parses signed degree values between the response delimiters. It records exact request parameters, URLs, hashes and retrieval timestamps. A 35-day hourly discovery scan precedes a ten-minute refinement of the first crossing in processing order. A separately requested initial Sun sample at each site tests query/parse consistency.

`scripts/check_release.py` is read-only. It compares every released angle with its raw response and validates sources, query identity, sample order/cadence, the complete shared sample matrix, manifest, frozen evidence archive and crossing brackets. `scripts/package_evidence.py` deliberately writes a separate deterministic archive under ignored `deliverables/`. Normal checks never rewrite public scientific artifacts. Scientific status remains provisional.

`src/science.ts` is the runtime Zod contract and the tested four-state visibility logic. The application first verifies release bytes against the manifest SHA-256, then validates identity and schema. The manifest detects inconsistent packaging; it is not a digital signature or a substitute for independent scientific review.

`src/App.tsx` composes four routes with shared data and selection providers. Explorer's `useObservation` owns the synchronized source cursor, sites, cadence, view and deterministic URL. Every diagram, numeric table, comparison and Loom derives from that exact timestamp. Both spatial and calibrated diagrams preserve negative elevation. `skyVectors.ts` maps north to negative Z, east to positive X and elevation to signed Y. The timeline batches individual sampled cells into SVG paths without averaging their states. Scrubbing makes no network requests; URL writes are coalesced and flushed after interaction. Event navigation filters to the chosen sites and sorts actual brackets chronologically.

The finder queries released sampled runs. Direct UTC selection rejects unavailable times and offers an explicit nearest supported sample without estimating a position. Guided investigations apply the same observation state as free exploration. Exports include four exact source rows and their provenance. A south-polar orthographic graticule places only the documented site coordinates; it is not a terrain map.

Vite builds static HTML for all four routes and a 404 page with `scripts/prerender.mjs`; the browser hydrates it and verifies data before showing readings. React Three Fiber scenes are lazy and render on demand. NASA lunar geometry and lighting supply visual context; local direction vectors use released angles. Reduced motion, failed assets, absent WebGL and context loss retain calibrated SVG interaction. Source hashes, transformations and visual-role limits are recorded in the asset provenance register.

The native modal has an accessible name, explicit keyboard focus wrapping that excludes closed-details content, Escape handling and focus restoration. Core data also exist as text tables. SVG text alternatives state exact angles and convention. Native sliders and previous/next controls provide keyboard access. Mobile displays one site at a time and retains the comparison; reduced motion removes transitions.

`tests/` exercises real browser journeys, failure/retry behavior, source links, evidence downloads, marker values, selected-site no-crossing behavior, mobile, reduced motion and axe accessibility audits. Test-only fault injection does not mutate the released scientific archive.

No terrain engine, database, account system, operational prediction, power model or RF model is present. No deployment or Git push has been performed under the latest owner instruction.
