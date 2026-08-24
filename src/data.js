// Mock data. All names fictional.
// The rule the whole design follows: history is what we learn from,
// this week is what you claim. History never becomes time entries.

export const USE_CASES = [
  {
    id: "track",
    title: "See where time goes",
    desc: "Log hours and spot where they really go",
    icon: "clock",
  },
  {
    id: "plan",
    title: "Plan and assign work",
    desc: "Map out tasks, then track against the plan",
    icon: "list",
  },
  {
    id: "projects",
    title: "Keep projects on track",
    desc: "Watch progress, profitability, and capacity in one place",
    icon: "chart",
  },
];

// Derived from 3 months of (mock) calendar history.
export const HISTORY_CLIENTS = [
  {
    id: "acme",
    label: "Acme",
    domain: "@acme.co",
    meetings: 47,
    hours: 62,
    cadence: "weekly, Tue + Thu",
    billable: true,
    dormant: false,
  },
  {
    id: "lumen",
    label: "Lumen Studio",
    domain: "@lumen.studio",
    meetings: 18,
    hours: 21,
    cadence: "fortnightly",
    billable: true,
    dormant: false,
  },
  {
    id: "internal",
    label: "Internal",
    domain: "1:1s and admin",
    meetings: 31,
    hours: 26,
    cadence: "weekly",
    billable: false,
    dormant: false,
  },
  {
    id: "north",
    label: "Studio North",
    domain: "@studio-north.com",
    meetings: 4,
    hours: 5,
    cadence: "last seen in June",
    billable: true,
    dormant: true,
  },
];

// This week: Mon Aug 24 to Fri Aug 28. day: 0 = Mon.
// start/end are hours in decimal, grid runs 08:00 to 19:00.
export const WEEK_MEETINGS = [
  { id: "m1", day: 0, start: 13, end: 15, title: "Acme · design review", clientId: "acme" },
  { id: "m2", day: 0, start: 15.5, end: 16.5, title: "Lumen · homepage feedback", clientId: "lumen" },
  { id: "m3", day: 1, start: 10, end: 10.5, title: "Acme standup", clientId: "acme" },
  { id: "m4", day: 1, start: 14, end: 15.5, title: "1:1 with Deniz", clientId: "internal" },
  { id: "m5", day: 2, start: 9, end: 10, title: "Weekly planning", clientId: "internal" },
  { id: "m6", day: 2, start: 11.5, end: 13.5, title: "Acme · sprint planning", clientId: "acme" },
  { id: "m7", day: 2, start: 15, end: 16.75, title: "Lumen · brand sync", clientId: "lumen" },
  { id: "m8", day: 3, start: 10, end: 10.5, title: "Acme standup", clientId: "acme" },
  { id: "m9", day: 3, start: 13, end: 15, title: "Lumen · review", clientId: "lumen" },
  { id: "m10", day: 3, start: 16, end: 18, title: "Javier / intro call", clientId: null },
  { id: "m11", day: 4, start: 9.5, end: 10.5, title: "Bookkeeping", clientId: "internal" },
  { id: "m12", day: 4, start: 13.5, end: 16.5, title: "Acme · workshop", clientId: "acme" },
];

export const DAYS = [
  { label: "Mon", date: 24 },
  { label: "Tue", date: 25 },
  { label: "Wed", date: 26 },
  { label: "Thu", date: 27 },
  { label: "Fri", date: 28 },
];

export function fmtHours(h) {
  const whole = Math.floor(h);
  const mins = Math.round((h - whole) * 60);
  if (whole === 0) return `${mins}m`;
  if (mins === 0) return `${whole}h`;
  return `${whole}h ${mins}m`;
}

export function meetingHours(m) {
  return m.end - m.start;
}
