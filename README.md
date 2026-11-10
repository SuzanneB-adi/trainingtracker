# SB Gym — Suzanne’s training tracker

A mobile-friendly, browser-local workout journal. No build, external JavaScript libraries, account, analytics or backend required.

## Open the app

Enable **Settings → Pages → Build and deployment → Source: Deploy from a branch**, choose **main**, **/ (root)**, and Save. GitHub will display the published URL when deployment finishes.

## Included

- Phase 2: 1 November–27 December 2026; 8 weeks and 3 workout days.
- All 16 exercises, video links, sets, rep targets, rest times and supersets.
- Weight and reps per set, left/right reps for unilateral leg exercises, session notes.
- Session stopwatch, individual exercise stopwatch and rest countdown. Timers use timestamps to tolerate background tabs; audible alerts depend on browser sound permissions and may be delayed when a phone sleeps.
- Trainer-ready PNG picture export with native phone sharing where available, plus download fallback.
- 50% and 80% warm-up targets at half planned reps, rounded up; loads round down to an achievable balanced setup. If even the empty handle is too heavy, no load is suggested.
- Working-load calculator: closest available balanced load, with requested and actual load both shown. Ties prefer the lower weight. Two adjustable dumbbells share the exact plate inventory. Dumbbell logs are kg per dumbbell; barbell logs include the bar.
- Equipment defaults: 3 kg bar (50 kg added-plate maximum), 0.5 kg dumbbell handles (25 kg total maximum each), 5×5 kg, 4×2.5 kg, 6×1.5 kg plates, fixed 5 kg dumbbell pair, 8 kg kettlebell. The plates sum to 44 kg, rather than the advertised 50 kg package.
- Weight and all ten body measurements from the supplied sheet, before/latest comparison, check-in history and progress picture.
- Editable plans and equipment; new eight-week blocks preserve old workout snapshots.
- JSON backup/restore for moving between phones.

## Data and privacy

Records live in this browser’s localStorage, not GitHub. There is no cross-device sync. Use the same browser and URL, avoid private browsing, and export backups regularly. Clearing site data or changing device/browser can remove access to records. The public repository contains only app code and the exercise plan. Fonts request Google Fonts; the app works with system fonts if unavailable. Trainer exports are generated locally, and are only shared when you choose Share or Save.

## Assumptions

The two superset exercises form three rounds. Dumbbell rows, lunges, presses, raises and curls use two matched dumbbells; tricep extensions, pullovers, Russian twists and goblet squats use a single load. These are editable. Warm-up completion is recorded separately from working sets. A new eight-week block initially copies the prior exercises for editing; automatic exercise prescription is not included. Existing logged sessions retain their exercise details when the plan is edited.

Use `node test.cjs` for calculator, logging and history checks. Run `python3 -m http.server 4174` to serve locally. No installation or build step.
