import { useEffect, useMemo, useRef, useState } from "react";
import {
  USE_CASES,
  HISTORY_CLIENTS,
  WEEK_MEETINGS,
  DAYS,
  fmtHours,
  meetingHours,
} from "./data.js";

/* ---------- tiny icons ---------- */
const I = {
  power: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 3v8" /><path d="M6.3 6.5a8 8 0 1 0 11.4 0" />
    </svg>
  ),
  clock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
    </svg>
  ),
  list: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  ),
  chart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 20V10M12 20V4M19 20v-7" />
    </svg>
  ),
  check: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12.5 9.5 18 20 6.5" />
    </svg>
  ),
  chevL: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  ),
  chevD: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  folder: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
    </svg>
  ),
  play: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 4.5v15l13-7.5-13-7.5z" />
    </svg>
  ),
  stop: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  ),
  reports: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  ),
  projects: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  ),
  tasks: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10 6h10M10 12h10M10 18h10" /><path d="M4 6l1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17" />
    </svg>
  ),
  timeline: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 7h8M7 12h10M11 17h8" />
    </svg>
  ),
  members: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" /><path d="M16 8.5a3 3 0 1 1 2 5.4M21 20c0-2.2-1.4-3.8-3.4-4.5" />
    </svg>
  ),
  star: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5L2.5 9.4l6.6-.9 2.9-6z" />
    </svg>
  ),
  g: <b className="gmark">G</b>,
};

const GRID_START = 8;
const GRID_END = 19;
const GRID_SPAN = GRID_END - GRID_START;

/* ---------- onboarding chrome ---------- */

function ObPage({ children }) {
  return (
    <div className="ob-page">
      <div className="ob-deco a" />
      <div className="ob-deco b" />
      <div className="ob-deco c" />
      {children}
    </div>
  );
}

function ObCard({ step, onBack, onSkip, children }) {
  return (
    <div className="ob-card">
      <div className="ob-top">
        {onBack ? (
          <button className="ob-back" onClick={onBack}>
            {I.chevL} BACK
          </button>
        ) : (
          <span />
        )}
        <div className="ob-progress">
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= step ? "on" : ""} />
          ))}
        </div>
        {onSkip ? (
          <button className="ob-skip" onClick={onSkip}>
            SKIP FOR NOW
          </button>
        ) : (
          <span />
        )}
      </div>
      {children}
    </div>
  );
}

/* ---------- step 1: use case ---------- */

function UseCaseStep({ value, onChange, onNext }) {
  return (
    <ObPage>
      <ObCard step={1}>
        <div className="ob-logo">{I.power}</div>
        <h1>Welcome to Toggl Focus</h1>
        <p className="ob-sub">What will you mainly use Toggl for?</p>
        <p className="ob-helper">We'll tailor your first experience to help you get there.</p>
        {USE_CASES.map((uc) => (
          <button
            key={uc.id}
            className={`uc-card ${value === uc.id ? "selected" : ""}`}
            onClick={() => onChange(uc.id)}
          >
            <span className="uc-icon">{I[uc.icon]}</span>
            <span className="uc-text">
              <b>{uc.title}</b>
              <span>{uc.desc}</span>
            </span>
            <span className="uc-check">{value === uc.id ? I.check : null}</span>
          </button>
        ))}
        <div className="ob-actions">
          <button className="btn-primary" disabled={!value} onClick={onNext}>
            Continue →
          </button>
        </div>
      </ObCard>
    </ObPage>
  );
}

/* ---------- step 2: calendar ---------- */

function CalendarStep({ state, onConnect, onBack, onSkip, onNext }) {
  return (
    <ObPage>
      <ObCard step={2} onBack={onBack} onSkip={state === "idle" ? onSkip : null}>
        <h1>Log time from your meetings and events</h1>
        <p className="ob-helper" style={{ marginTop: 6 }}>
          Connect your calendar and your meetings and events are ready to track
        </p>
        {state === "connecting" ? (
          <div className="spinner" role="status" aria-label="Connecting" />
        ) : (
          <>
            <div className={`conn-row ${state === "connected" ? "connected" : ""}`}>
              <span className="conn-logo g">31</span>
              <span className="conn-text">
                <b>Google Calendar</b>
                {state === "connected" ? (
                  <span className="ok">✓ Connected · 3 months of history found</span>
                ) : (
                  <span>Import your meetings so they turn into tracked time</span>
                )}
              </span>
              {state !== "connected" && (
                <button className="conn-btn" onClick={onConnect}>
                  Connect
                </button>
              )}
            </div>
            <div className="conn-row">
              <span className="conn-logo o">O</span>
              <span className="conn-text">
                <b>Microsoft Outlook</b>
                <span>Import your meetings so they turn into tracked time</span>
              </span>
              <button className="conn-btn" onClick={onConnect}>
                Connect
              </button>
            </div>
            <div className="conn-toggle-row">
              <span>Auto-track calendar events</span>
              <span className="toggle" aria-label="On" />
            </div>
            {state === "connected" && (
              <div className="ob-actions">
                <button className="btn-primary" onClick={onNext}>
                  Continue →
                </button>
              </div>
            )}
          </>
        )}
      </ObCard>
    </ObPage>
  );
}

/* ---------- step 3: clients found (or typed project on skip path) ---------- */

function ClientsStep({ connected, clients, setClients, projName, setProjName, onBack, onNext }) {
  if (!connected) {
    return (
      <ObPage>
        <ObCard step={3} onBack={onBack}>
          <h1>Create your first project</h1>
          <p className="ob-helper" style={{ marginTop: 6 }}>
            Projects keep your work and time logs organized
          </p>
          <label className="small-label proj-label" htmlFor="proj">
            PROJECT
          </label>
          <input
            id="proj"
            className="proj-input"
            placeholder="Website redesign"
            value={projName}
            onChange={(e) => setProjName(e.target.value)}
          />
          <div className="ob-actions">
            <button className="btn-primary" disabled={!projName.trim()} onClick={onNext}>
              Continue →
            </button>
          </div>
        </ObCard>
      </ObPage>
    );
  }

  const active = clients.filter((c) => c.enabled).length;
  return (
    <ObPage>
      <ObCard step={3} onBack={onBack}>
        <h1>We found your clients</h1>
        <p className="cf-intro">
          From 3 months of your calendar. Confirm them and your projects are ready.
          Nothing from the past becomes a time entry.
        </p>
        {clients.map((c) => (
          <div key={c.id} className={`cf-row ${c.enabled ? "" : "off"}`}>
            <input
              type="checkbox"
              className="cf-check"
              checked={c.enabled}
              aria-label={`Create a project for ${c.label}`}
              onChange={() =>
                setClients(clients.map((x) => (x.id === c.id ? { ...x, enabled: !x.enabled } : x)))
              }
            />
            <span className="cf-folder">{I.folder}</span>
            <span className="cf-main">
              <span className="cf-name-wrap">
                <input
                  className="cf-name-input"
                  value={c.label}
                  aria-label={`Project name for ${c.domain}`}
                  onChange={(e) =>
                    setClients(clients.map((x) => (x.id === c.id ? { ...x, label: e.target.value } : x)))
                  }
                />
                <svg className="cf-pencil" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M17 3l4 4L8 20l-5 1 1-5L17 3z" />
                </svg>
              </span>
              <div className="cf-meta">
                {c.domain} · {c.meetings} meetings · {c.hours}h · {c.cadence}
              </div>
            </span>
            {c.billable ? (
              <span className="cf-tag" title="Meetings with this client will count as billable time">
                $ billable
              </span>
            ) : (
              <span className="cf-tag muted" title="Tracked, but never counts toward billing">
                not billed
              </span>
            )}
          </div>
        ))}
        <p className="cf-note">Guessed from attendee domains and recurring titles. Edit anything.</p>
        <div className="ob-actions">
          <button className="btn-primary" disabled={active === 0} onClick={onNext}>
            Create {active} {active === 1 ? "project" : "projects"} →
          </button>
        </div>
      </ObCard>
    </ObPage>
  );
}

/* ---------- step 3.5 ---------- */

function SetupStep() {
  return (
    <div className="setup-page">
      <div className="ob-deco a" />
      <div className="ob-deco b" />
      <div className="setup-inner">
        <div className="ob-logo">{I.power}</div>
        <h1>You're all set</h1>
        <p>Setting up your workspace...</p>
        <div className="setup-bar" />
      </div>
    </div>
  );
}

/* ---------- app shell ---------- */

const NAV = [
  { section: "TRACK", items: [{ id: "timer", label: "Timer", icon: "clock", active: true }] },
  { section: "ANALYZE", items: [{ id: "reports", label: "Reports", icon: "reports" }] },
  {
    section: "PLAN",
    items: [
      { id: "projects", label: "Projects", icon: "projects" },
      { id: "tasks", label: "Tasks", icon: "tasks" },
      { id: "timeline", label: "Timeline", icon: "timeline", star: true },
    ],
  },
  {
    section: "MANAGE",
    items: [
      { id: "members", label: "Members", icon: "members" },
      { id: "approvals", label: "Approvals", icon: "tasks", star: true },
      { id: "timeoff", label: "Time off", icon: "clock", star: true },
    ],
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="ws-row">
        <span className="ws-logo">
          {I.power}
          <i>2.0</i>
        </span>
        <span className="ws-name">Your workspace</span>
      </div>
      {NAV.map((s) => (
        <div key={s.section}>
          <div className="nav-section small-label">{s.section}</div>
          {s.items.map((it) => (
            <button key={it.id} className={`nav-item ${it.active ? "active" : "dead"}`} title={it.active ? undefined : "Not part of this prototype"}>
              {I[it.icon]}
              {it.label}
              {it.star && <span className="star">{I.star}</span>}
            </button>
          ))}
        </div>
      ))}
      <div className="side-foot">
        <button className="nav-item dead">
          {I.chart}
          Upgrade
          <span className="upgrade-chip">31 DAYS</span>
        </button>
        <button className="nav-item dead">{I.reports}Download apps</button>
        <button className="nav-item dead">{I.projects}Admin settings</button>
      </div>
    </aside>
  );
}

function fmtTimer(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/* ---------- main app ---------- */

export default function App() {
  const [step, setStep] = useState("usecase");
  const [useCase, setUseCase] = useState(null);
  const [calState, setCalState] = useState("idle"); // idle | connecting | connected | skipped
  const [clients, setClients] = useState(
    HISTORY_CLIENTS.map((c) => ({ ...c, enabled: !c.dormant }))
  );
  const [projName, setProjName] = useState("");

  // app state
  const [day, setDay] = useState(1);
  const [claimed, setClaimed] = useState(false);
  const [dismissed, setDismissed] = useState([]);
  const [overrides, setOverrides] = useState({});
  const [rate, setRate] = useState(null);
  const [rateInput, setRateInput] = useState("");
  const [rateHidden, setRateHidden] = useState(false);
  const [stripGone, setStripGone] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [toast, setToast] = useState(null);
  const [timerOn, setTimerOn] = useState(false);
  const [timerSec, setTimerSec] = useState(0);
  const timerRef = useRef(null);
  const setDayViaDemoRef = useRef(() => {});

  const connected = calState === "connected";

  useEffect(() => {
    if (step === "setup") {
      const t = setTimeout(() => setStep("app"), 1300);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    if (timerOn) {
      timerRef.current = setInterval(() => setTimerSec((s) => s + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [timerOn]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onKey = (e) => {
      if (
        step === "app" &&
        calState === "connected" &&
        (e.key === "d" || e.key === "D") &&
        e.target.tagName !== "INPUT"
      ) {
        setDayViaDemoRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, calState]);

  /* ----- derived ----- */
  const effClient = (m) => overrides[m.id] !== undefined ? overrides[m.id] : m.clientId;
  const activeClients = clients.filter((c) => c.enabled);
  const clientById = Object.fromEntries(clients.map((c) => [c.id, c]));

  const liveMeetings = useMemo(
    () => (connected ? WEEK_MEETINGS.filter((m) => !dismissed.includes(m.id)) : []),
    [connected, dismissed]
  );

  const attributed = liveMeetings.filter((m) => {
    const c = effClient(m);
    return c && clientById[c] && clientById[c].enabled;
  });
  const unmatched = liveMeetings.filter((m) => !attributed.includes(m));

  const groups = useMemo(() => {
    const mode = useCase === "plan" ? "day" : "client"; // "projects" groups by client too, labels differ
    if (mode === "day") {
      return DAYS.map((d, i) => ({
        key: `day-${i}`,
        name: `${d.label} ${d.date}`,
        kind: "day",
        meetings: attributed.filter((m) => m.day === i),
      })).filter((g) => g.meetings.length > 0);
    }
    return activeClients
      .map((c) => ({
        key: c.id,
        name: c.label,
        kind: c.billable ? "client" : "internal",
        meetings: attributed.filter((m) => effClient(m) === c.id),
      }))
      .filter((g) => g.meetings.length > 0);
  }, [attributed, activeClients, useCase, overrides]);

  const totalH = attributed.reduce((s, m) => s + meetingHours(m), 0);
  const billableH = attributed.reduce((s, m) => {
    const c = clientById[effClient(m)];
    return c && c.billable ? s + meetingHours(m) : s;
  }, 0);
  const money = rate ? billableH * rate : null;

  const dayHours = (di) =>
    attributed.filter((m) => m.day === di).reduce((s, m) => s + meetingHours(m), 0);

  const goDay = (target) => {
    if (target === 2 && !claimed) setClaimed(true); // the demo's "next morning" presumes yesterday was claimed
    setDay(target);
  };

  setDayViaDemoRef.current = () => goDay(day === 1 ? 2 : 1);

  const claimAll = () => {
    setClaimed(true);
    setToast({
      title: `${fmtHours(totalH)} logged across ${groups.filter((g) => g.kind !== "day").length || 3} projects`,
      body: "Reports updated. Nothing was invented: every entry came from your calendar.",
    });
  };

  const claimHeadline = {
    track: "You said you want to see where time goes.",
    plan: "You said you want to plan and assign work.",
    projects: "You said you want to keep projects on track.",
  }[useCase] || "Your week is here.";

  /* ----- onboarding flow ----- */
  if (step === "usecase")
    return <UseCaseStep value={useCase} onChange={setUseCase} onNext={() => setStep("calendar")} />;

  if (step === "calendar")
    return (
      <CalendarStep
        state={calState}
        onBack={() => setStep("usecase")}
        onSkip={() => {
          setCalState("skipped");
          setStep("clients");
        }}
        onConnect={() => {
          setCalState("connecting");
          setTimeout(() => setCalState("connected"), 900);
        }}
        onNext={() => setStep("clients")}
      />
    );

  if (step === "clients")
    return (
      <ClientsStep
        connected={connected}
        clients={clients}
        setClients={setClients}
        projName={projName}
        setProjName={setProjName}
        onBack={() => setStep("calendar")}
        onNext={() => setStep("setup")}
      />
    );

  if (step === "setup") return <SetupStep />;

  /* ----- the app ----- */

  const isDay2 = day === 2;
  const todayIdx = isDay2 ? 1 : 0;
  const nowHour = isDay2 ? 9.66 : 14.1;
  const monHours = dayHours(0);
  const monMoney = rate
    ? attributed
        .filter((m) => m.day === 0 && clientById[effClient(m)]?.billable)
        .reduce((s, m) => s + meetingHours(m), 0) * rate
    : null;
  const todayMeetings = attributed.filter((m) => m.day === 1);
  const nextBlock = todayMeetings.find((m) => m.start >= nowHour);

  const showPanel = connected && !isDay2;
  const gridMeetings = connected ? liveMeetings : [];

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        {/* top bar */}
        <div className="topbar">
          <h2 className={timerOn ? "live" : ""}>
            {timerOn ? `${nextBlock ? nextBlock.title : "Acme standup"}` : "What are you working on?"}
          </h2>
          <span className="chip">@ Task</span>
          <span className="chip">+ Project</span>
          <span className="chip"># Tags</span>
          <span className="timer-readout">{fmtTimer(timerSec)}</span>
          <button
            className={`play-btn ${timerOn ? "stop" : ""}`}
            aria-label={timerOn ? "Stop timer" : "Start timer"}
            onClick={() => setTimerOn((v) => !v)}
          >
            {timerOn ? I.stop : I.play}
          </button>
        </div>

        {/* week bar */}
        <div className="weekbar">
          <div className="weekpill">
            {I.chevL} This week <span>· W35</span>
          </div>
          <div className="right">
            {claimed ? (
              <>
                <span>
                  Logged <b style={{ color: "var(--ink)" }}>{fmtHours(isDay2 ? monHours : totalH)}</b>
                </span>
                {money !== null && (
                  <span style={{ color: "var(--green)", fontWeight: 700 }}>
                    ${Math.round(isDay2 ? monMoney : money).toLocaleString()}
                  </span>
                )}
              </>
            ) : (
              <span>Logged 0h · Planned 0h</span>
            )}
            <span>5 Days ▾</span>
          </div>
        </div>

        {/* strips */}
        {!isDay2 && !stripGone && connected && !claimed && (
          <div className="strip">
            <span>
              <b>{claimHeadline}</b> We found {liveMeetings.length} meetings this week,{" "}
              {fmtHours(liveMeetings.reduce((s, m) => s + meetingHours(m), 0))}. None of it is
              tracked yet.
            </span>
            <button className="x" aria-label="Dismiss" onClick={() => setStripGone(true)}>
              ✕
            </button>
          </div>
        )}
        {!isDay2 && claimed && !stripGone && (
          <div className="strip green">
            <span>
              <b>{fmtHours(totalH)} logged.</b> Your week now counts. Reports went from 0h to{" "}
              {fmtHours(totalH)}
              {money !== null && <> and ${Math.round(money).toLocaleString()}</>}.
            </span>
            <button className="x" aria-label="Dismiss" onClick={() => setStripGone(true)}>
              ✕
            </button>
          </div>
        )}
        {!connected && !stripGone && (
          <div className="strip">
            <span>
              <b>We added a sample task so you can try tracking.</b> Add your own any time, or
              connect your calendar to log your real week.
            </span>
            <button className="x" aria-label="Dismiss" onClick={() => setStripGone(true)}>
              ✕
            </button>
          </div>
        )}
        {isDay2 && (
          <div className="d2strip">
            <div className="stat">
              <b>{fmtHours(monHours)}</b>
              <span>tracked yesterday</span>
            </div>
            {monMoney !== null && (
              <>
                <div className="divider" />
                <div className="stat">
                  <b>${Math.round(monMoney).toLocaleString()}</b>
                  <span>earned yesterday</span>
                </div>
              </>
            )}
            <div className="divider" />
            <div className="stat">
              <b>Acme</b>
              <span>most tracked client this week</span>
            </div>
            <div className="divider" />
            <span style={{ color: "var(--ink-2)", fontSize: 13 }}>
              {nextBlock
                ? `Your first block starts in 20 minutes: ${nextBlock.title}`
                : "No more meetings today."}
            </span>
          </div>
        )}

        {/* content */}
        <div className={`content ${connected ? "" : "solo"}`}>
          <div className="grid-wrap">
            <div className="grid-head">
              <span />
              {DAYS.map((d, i) => {
                const h = claimed ? dayHours(i) : 0;
                return (
                  <div key={d.label} className={`day-head ${i === todayIdx ? "today" : ""}`}>
                    <span className="num">{d.date}</span>
                    <span>
                      <span className="lbl">{d.label}</span>
                      <br />
                      <span className={`sum ${h > 0 ? "live" : ""}`}>
                        {h > 0 ? fmtHours(h) : "–"} / –
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="grid-body">
              <div className="hours-col">
                {Array.from({ length: GRID_SPAN }, (_, i) => (
                  <div key={i} className="hour-cell">
                    {((GRID_START + i - 1) % 12) + 1}:00 {GRID_START + i < 12 ? "AM" : "PM"}
                  </div>
                ))}
              </div>
              {DAYS.map((d, di) => (
                <div key={d.label} className="day-col">
                  {Array.from({ length: GRID_SPAN }, (_, i) => (
                    <div key={i} className="hour-line" />
                  ))}
                  {di === todayIdx && (
                    <div
                      className="now-line"
                      style={{ top: `${((nowHour - GRID_START) / GRID_SPAN) * 100}%` }}
                    />
                  )}
                  {!connected && di === 0 && (
                    <div
                      className="evt claimed"
                      style={{ top: "18.2%", height: "13.6%" }}
                    >
                      <b>{projName || "Sample task"}</b>
                      <span className="dur">1h 30m</span>
                    </div>
                  )}
                  {gridMeetings
                    .filter((m) => m.day === di)
                    .map((m) => {
                      const c = clientById[effClient(m)];
                      const isClaimed = claimed && c && c.enabled;
                      return (
                        <div
                          key={m.id}
                          className={`evt ${isClaimed ? "claimed" : "gcal"}`}
                          style={{
                            top: `${((m.start - GRID_START) / GRID_SPAN) * 100}%`,
                            height: `${(meetingHours(m) / GRID_SPAN) * 100}%`,
                          }}
                        >
                          {!isClaimed && I.g}
                          <b>{m.title}</b>
                          {isClaimed && <span className="proj">{c.label}</span>}
                          <span className="dur">{fmtHours(meetingHours(m))}</span>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>

          {/* claim panel */}
          {showPanel && (
            <div className="panel">
              {!claimed ? (
                <>
                  <div className="panel-head">
                    <span className="small-label">This week</span>
                    <h3>Log your week</h3>
                    <p>
                      {liveMeetings.length} meetings from your calendar, grouped by{" "}
                      {useCase === "plan" ? "day" : "client"}. Review, then log it in one go.
                    </p>
                  </div>
                  <div className="panel-body">
                    {groups.length === 0 && unmatched.length === 0 ? (
                      <div className="empty-claim">
                        <b>Nothing left to log</b>
                        You dismissed everything. Track your first entry with the timer above, or
                        press D to see day two.
                      </div>
                    ) : (
                      <>
                        {groups.map((g) => (
                          <div key={g.key} className="group">
                            <button
                              className="group-head"
                              onClick={() => setExpanded(expanded === g.key ? null : g.key)}
                              aria-expanded={expanded === g.key}
                            >
                              <span className={`gdot ${g.kind === "internal" ? "internal" : ""}`} />
                              <span className="gname">{g.name}</span>
                              <span className="gmeta">
                                {g.meetings.length} · {fmtHours(g.meetings.reduce((s, m) => s + meetingHours(m), 0))}
                              </span>
                              <span className="chev">{I.chevD}</span>
                            </button>
                            {expanded === g.key && (
                              <div className="group-rows">
                                {g.meetings.map((m) => (
                                  <div key={m.id} className="mrow">
                                    <span className="t">{m.title}</span>
                                    <span className="d">{fmtHours(meetingHours(m))}</span>
                                    <select
                                      value={effClient(m) || ""}
                                      aria-label="Assign client"
                                      onChange={(e) =>
                                        setOverrides({ ...overrides, [m.id]: e.target.value || null })
                                      }
                                    >
                                      {activeClients.map((c) => (
                                        <option key={c.id} value={c.id}>
                                          {c.label}
                                        </option>
                                      ))}
                                      <option value="">Unassigned</option>
                                    </select>
                                    <button
                                      className="rm"
                                      aria-label="Dismiss meeting"
                                      title="Not work, remove"
                                      onClick={() => setDismissed([...dismissed, m.id])}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                        {unmatched.length > 0 && (
                          <div className="group">
                            <button
                              className="group-head"
                              onClick={() => setExpanded(expanded === "un" ? null : "un")}
                              aria-expanded={expanded === "un"}
                            >
                              <span className="gdot unmatched" />
                              <span className="gname">Needs review</span>
                              <span className="gmeta">
                                {unmatched.length} ·{" "}
                                {fmtHours(unmatched.reduce((s, m) => s + meetingHours(m), 0))}
                              </span>
                              <span className="chev">{I.chevD}</span>
                            </button>
                            {expanded === "un" && (
                              <div className="group-rows">
                                {unmatched.map((m) => (
                                  <div key={m.id} className="mrow">
                                    <span className="t">{m.title}</span>
                                    <span className="d">{fmtHours(meetingHours(m))}</span>
                                    <select
                                      value=""
                                      aria-label="Assign client"
                                      onChange={(e) =>
                                        e.target.value &&
                                        setOverrides({ ...overrides, [m.id]: e.target.value })
                                      }
                                    >
                                      <option value="">Assign…</option>
                                      {activeClients.map((c) => (
                                        <option key={c.id} value={c.id}>
                                          {c.label}
                                        </option>
                                      ))}
                                    </select>
                                    <button
                                      className="rm"
                                      aria-label="Dismiss meeting"
                                      onClick={() => setDismissed([...dismissed, m.id])}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {attributed.length > 0 && (
                    <div className="panel-foot">
                      <button className="claim-btn" onClick={claimAll}>
                        Log {fmtHours(totalH)}
                      </button>
                      <p className="note">
                        Only this week becomes entries. History was just how we learned.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="panel-head">
                    <span className="small-label">Logged</span>
                    <h3>Your week now counts</h3>
                  </div>
                  <div className="panel-body">
                    <div className="sumcard">
                      <div className="big">{fmtHours(totalH)}</div>
                      <div className="sub">
                        logged across{" "}
                        {activeClients.filter((c) => attributed.some((m) => effClient(m) === c.id)).length}{" "}
                        projects
                      </div>
                      <div style={{ marginTop: 10 }}>
                        {activeClients
                          .map((c) => ({
                            c,
                            h: attributed
                              .filter((m) => effClient(m) === c.id)
                              .reduce((s, m) => s + meetingHours(m), 0),
                          }))
                          .filter((x) => x.h > 0)
                          .map(({ c, h }) => (
                            <div key={c.id} className="sumline">
                              <b>{c.label}</b>
                              <span>
                                {fmtHours(h)}
                                {rate && c.billable && (
                                  <>
                                    {" "}
                                    · <span className="money">${Math.round(h * rate).toLocaleString()}</span>
                                  </>
                                )}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                    {!rate && !rateHidden && (
                      <div className="ratecard">
                        <b>What is an hour of your work worth?</b>
                        <p>
                          Add your rate and this week gets a value. Skip it and your week stays a
                          clean, attributed record. You can set rates per client later.
                        </p>
                        <div className="rate-row">
                          <input
                            className="rate-input"
                            type="number"
                            min="1"
                            placeholder="80"
                            aria-label="Hourly rate in USD"
                            value={rateInput}
                            onChange={(e) => setRateInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && Number(rateInput) > 0)
                                setRate(Number(rateInput));
                            }}
                          />
                          <button
                            className="btn-primary"
                            disabled={!(Number(rateInput) > 0)}
                            onClick={() => setRate(Number(rateInput))}
                          >
                            Apply
                          </button>
                        </div>
                        <button className="rate-skip" onClick={() => setRateHidden(true)}>
                          SKIP FOR NOW
                        </button>
                      </div>
                    )}
                    {rate && (
                      <div className="sumcard">
                        <div className="big" style={{ color: "var(--green)" }}>
                          ${Math.round(money).toLocaleString()}
                        </div>
                        <div className="sub">
                          {fmtHours(billableH)} billable at ${rate}/h. Press D to see tomorrow.
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* day two panel */}
          {connected && isDay2 && (
            <div className="panel">
              <div className="panel-head">
                <span className="small-label">Tuesday</span>
                <h3>Good morning</h3>
                <p>Here is what is waiting today.</p>
              </div>
              <div className="panel-body">
                {nextBlock && (
                  <div className="nextblock">
                    <div className="nb-main">
                      <b>{nextBlock.title}</b>
                      <span>
                        10:00 · {fmtHours(meetingHours(nextBlock))} ·{" "}
                        {clientById[effClient(nextBlock)]?.label || "Unassigned"}
                      </span>
                    </div>
                    <button
                      className="nb-start"
                      onClick={() => {
                        setTimerOn(true);
                      }}
                    >
                      {I.play} Start
                    </button>
                  </div>
                )}
                {todayMeetings.map((m) => (
                  <div key={m.id} className="mrow" style={{ border: "1px solid var(--line)", borderRadius: 10, marginBottom: 8 }}>
                    <span className="t">{m.title}</span>
                    <span className="d">{fmtHours(meetingHours(m))}</span>
                    <span className="d" style={{ color: "var(--magenta)", fontWeight: 700 }}>
                      {clientById[effClient(m)]?.label}
                    </span>
                  </div>
                ))}
                <div className="sumcard" style={{ marginTop: 14 }}>
                  <div className="big">{fmtHours(monHours)}</div>
                  <div className="sub">
                    tracked yesterday{monMoney !== null && <> · ${Math.round(monMoney).toLocaleString()} earned</>}.
                    This number is why you opened the app today.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* demo pill */}
        {connected && (
        <button className="demo-pill" onClick={() => goDay(day === 1 ? 2 : 1)}>
          {day === 1 ? "▶ Demo: next morning" : "◀ Back to day one"}
          <span className="tag">D</span>
        </button>
        )}

        {toast && (
          <div className="toast" role="status">
            <b>{toast.title}</b>
            {toast.body}
          </div>
        )}
      </main>
    </div>
  );
}
