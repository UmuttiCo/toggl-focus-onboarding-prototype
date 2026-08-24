# Toggl Focus onboarding prototype

A redesign of the Toggl Focus first-run experience, built for a product case study.

The idea in one line: Toggl Focus already imports your calendar, so onboarding should end with a claimed, attributed week instead of an empty grid.

## What it shows

1. The three onboarding questions, kept as they are in the live product, but every answer now does something.
2. The blank "create your first project" box is replaced by client suggestions derived from 3 months of calendar history.
3. The landing screen is a claim screen: this week's imported meetings grouped by client, claimed in one action.
4. The hourly rate is asked after the claim, when the value is visible. Skipping it keeps the week as a clean record (the contractor path). Filling it prices the week (the freelancer path).
5. A day-two view, reachable with the pill at the bottom left or the D key, shows why the user comes back: yesterday's number and today's unclaimed meetings.

One rule holds the design together: history is what we learn from, this week is what you claim. Nothing from the past becomes a time entry.

## Run it

```
npm install
npm run dev
```

Node 18 or newer. No backend, no persistence: refresh restarts the flow. Desktop only.

## Notes

- All data is mocked in `src/data.js`. Client names are fictional.
- Design tokens are sampled from the live product (Aug 2026).
- The skip path is built: skipping the calendar connect falls back to a typed project name and a sample task, never an empty grid.
