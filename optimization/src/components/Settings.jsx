import { useState } from "react";

const INITIAL = {
  name: "Ashish",
  email: "ashish@example.com",
  timezone: "Asia/Kolkata",
  emailAlerts: true,
  incidentAlerts: true,
  weeklyDigest: false,
  theme: "system",
  density: "comfortable",
};

const TABS = ["Profile", "Notifications", "Appearance"];

function Toggle({ id, checked, onChange, label, hint }) {
  return (
    <div className="row">
      <div>
        <label htmlFor={id}>{label}</label>
        {hint && <p className="muted">{hint}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        className={`switch ${checked ? "on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}

const Settings = () => {
  const [saved, setSaved] = useState(INITIAL);
  const [form, setForm] = useState(INITIAL);
  const [tab, setTab] = useState("Profile");
  const [status, setStatus] = useState("");

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setStatus("");
  };
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const emailValid = /^\S+@\S+\.\S+$/.test(form.email);

  const save = () => {
    if (!emailValid) return;
    setSaved(form); // replace with an API call
    setStatus("Settings saved");
  };
  const discard = () => {
    setForm(saved);
    setStatus("");
  };

  return (
    <div className="set">
      <style>{css}</style>
      <h1>Settings</h1>

      <div className="layout">
        <nav className="tabs" aria-label="Settings sections">
          {TABS.map((t) => (
            <button
              key={t}
              className={t === tab ? "on" : ""}
              aria-current={t === tab ? "page" : undefined}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </nav>

        <div className="card">
          {tab === "Profile" && (
            <>
              <h2>Profile</h2>
              <div className="field">
                <label htmlFor="name">Display name</label>
                <input id="name" value={form.name} onChange={(e) => set("name")(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  aria-invalid={!emailValid}
                  onChange={(e) => set("email")(e.target.value)}
                />
                {!emailValid && <p className="err">Enter a valid email address, like name@company.com.</p>}
              </div>
              <div className="field">
                <label htmlFor="tz">Time zone</label>
                <select id="tz" value={form.timezone} onChange={(e) => set("timezone")(e.target.value)}>
                  <option>Asia/Kolkata</option>
                  <option>UTC</option>
                  <option>Europe/London</option>
                  <option>America/New_York</option>
                </select>
              </div>
            </>
          )}

          {tab === "Notifications" && (
            <>
              <h2>Notifications</h2>
              <Toggle id="ea" label="Email alerts" hint="Get an email when a service changes status."
                checked={form.emailAlerts} onChange={set("emailAlerts")} />
              <Toggle id="ia" label="Incident updates" hint="Follow updates on incidents you're assigned to."
                checked={form.incidentAlerts} onChange={set("incidentAlerts")} />
              <Toggle id="wd" label="Weekly digest" hint="A summary of uptime and errors every Monday."
                checked={form.weeklyDigest} onChange={set("weeklyDigest")} />
            </>
          )}

          {tab === "Appearance" && (
            <>
              <h2>Appearance</h2>
              <div className="field">
                <label htmlFor="theme">Theme</label>
                <select id="theme" value={form.theme} onChange={(e) => set("theme")(e.target.value)}>
                  <option value="system">Match system</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="density">Table density</label>
                <select id="density" value={form.density} onChange={(e) => set("density")(e.target.value)}>
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                </select>
              </div>
            </>
          )}

          <div className="actions">
            <span className="ok" role="status">{status}</span>
            <button className="ghost" onClick={discard} disabled={!dirty}>Discard changes</button>
            <button className="primary" onClick={save} disabled={!dirty || !emailValid}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const css = `
.set{--bg:#f3f5f7;--card:#fff;--ink:#16202a;--muted:#6b7784;--line:#e2e7ec;--accent:#0f766e;--good:#15803d;--bad:#b91c1c;
  font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:var(--bg);color:var(--ink);min-height:100vh;padding:24px;max-width:900px;margin:0 auto}
.set h1{font-size:1.4rem;margin:0 0 16px}.set h2{font-size:1rem;margin:0 0 16px}
.layout{display:grid;grid-template-columns:180px 1fr;gap:16px;align-items:start}
.tabs{display:grid;gap:4px}
.tabs button{text-align:left;border:0;background:none;padding:8px 12px;border-radius:8px;font:inherit;color:var(--muted);cursor:pointer}
.tabs button.on{background:var(--card);color:var(--ink);font-weight:600;border:1px solid var(--line)}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:20px}
.field{display:grid;gap:6px;margin-bottom:16px}
.field label,.row label{font-size:.9rem;font-weight:550}
input,select{font:inherit;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink)}
input[aria-invalid="true"]{border-color:var(--bad)}
.err{color:var(--bad);font-size:.8rem;margin:0}
.muted{color:var(--muted);font-size:.85rem;margin:2px 0 0}
.row{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:12px 0;border-bottom:1px solid var(--line)}
.row:last-of-type{border-bottom:0}
.switch{width:40px;height:22px;border-radius:99px;border:0;background:#cbd3da;position:relative;cursor:pointer;flex:none;transition:background .15s}
.switch span{position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .15s}
.switch.on{background:var(--accent)}.switch.on span{transform:translateX(18px)}
.actions{display:flex;justify-content:flex-end;align-items:center;gap:10px;margin-top:20px;padding-top:16px;border-top:1px solid var(--line)}
.ok{margin-right:auto;color:var(--good);font-size:.85rem}
.primary,.ghost{font:inherit;padding:8px 16px;border-radius:8px;cursor:pointer;border:1px solid var(--line)}
.primary{background:var(--accent);border-color:var(--accent);color:#fff}
.ghost{background:var(--card);color:var(--ink)}
.set button:disabled{opacity:.45;cursor:not-allowed}
.set button:focus-visible,.set input:focus-visible,.set select:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (max-width:640px){.layout{grid-template-columns:1fr}.tabs{grid-auto-flow:column}.set{padding:12px}}
`;

export default Settings;