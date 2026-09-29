import { useMemo, useState } from "react";

// Mock data — swap for API / WebSocket data later.
const RANGES = {
  "1h": [220, 240, 231, 260, 255, 290, 310, 298, 320, 345, 330, 360],
  "24h": [180, 210, 190, 260, 300, 280, 340, 320, 380, 360, 410, 395],
  "7d": [150, 190, 230, 210, 280, 300, 350, 330, 370, 420, 400, 450],
};

const SERVICES = [
  { name: "Stream ingest", status: "healthy", latency: 42, errors: 0.1 },
  { name: "Auth gateway", status: "healthy", latency: 58, errors: 0.2 },
  { name: "Playback API", status: "degraded", latency: 240, errors: 2.4 },
  { name: "Metrics collector", status: "healthy", latency: 31, errors: 0.0 },
  { name: "Notification worker", status: "down", latency: 0, errors: 100 },
];

const STATS = [
  { label: "Active viewers", value: "12,480", delta: "+4.2%", up: true },
  { label: "Avg latency", value: "94 ms", delta: "+11 ms", up: false },
  { label: "Error rate", value: "0.8%", delta: "-0.3%", up: true },
  { label: "Uptime (30d)", value: "99.94%", delta: "-0.01%", up: false },
];

function LineChart({ data }) {
  const w = 600, h = 180, pad = 8;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => [
    pad + (i * (w - pad * 2)) / (data.length - 1),
    h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2),
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const area = `${line} L${pts.at(-1)[0]},${h} L${pts[0][0]},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart" role="img" aria-label="Requests per second">
      <path d={area} className="chart-area" />
      <path d={line} className="chart-line" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" className="chart-dot" />)}
    </svg>
  );
}

const Dashboard = () => {
  const [range, setRange] = useState("24h");
  const [filter, setFilter] = useState("all");

  const rows = useMemo(
    () => (filter === "all" ? SERVICES : SERVICES.filter((s) => s.status === filter)),
    [filter]
  );

  return (
    <div className="dash">
      <style>{css}</style>

      <header className="bar">
        <h1>Service overview</h1>
        <div className="seg" role="group" aria-label="Time range">
          {Object.keys(RANGES).map((r) => (
            <button key={r} className={r === range ? "on" : ""} onClick={() => setRange(r)}>
              {r}
            </button>
          ))}
        </div>
      </header>

      <section className="stats">
        {STATS.map((s) => (
          <div className="card" key={s.label}>
            <p className="muted">{s.label}</p>
            <p className="big">{s.value}</p>
            <p className={s.up ? "good" : "bad"}>{s.delta} vs previous period</p>
          </div>
        ))}
      </section>

      <section className="card">
        <h2>Requests per second</h2>
        <LineChart data={RANGES[range]} />
      </section>

      <section className="card">
        <div className="bar">
          <h2>Services</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option value="healthy">Healthy</option>
            <option value="degraded">Degraded</option>
            <option value="down">Down</option>
          </select>
        </div>
        <table>
          <thead>
            <tr><th>Service</th><th>Status</th><th>Latency</th><th>Errors</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan="4" className="muted">No services match this filter.</td></tr>
            )}
            {rows.map((s) => (
              <tr key={s.name}>
                <td>{s.name}</td>
                <td><span className={`pill ${s.status}`}>{s.status}</span></td>
                <td>{s.status === "down" ? "–" : `${s.latency} ms`}</td>
                <td>{s.errors}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const css = `
.dash{--bg:#f3f5f7;--card:#fff;--ink:#16202a;--muted:#6b7784;--line:#e2e7ec;--accent:#0f766e;--good:#15803d;--bad:#b91c1c;--warn:#b45309;
  font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:var(--bg);color:var(--ink);min-height:100vh;padding:24px;display:grid;gap:16px;max-width:1100px;margin:0 auto}
.dash h1{font-size:1.4rem;margin:0}.dash h2{font-size:1rem;margin:0 0 12px}
.bar{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.bar h2{margin:0}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
.stats p{margin:0}.big{font-size:1.8rem;font-weight:650;margin:4px 0!important}
.muted{color:var(--muted);font-size:.875rem}.good{color:var(--good);font-size:.8rem}.bad{color:var(--bad);font-size:.8rem}
.seg{display:flex;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--card)}
.seg button{border:0;background:none;padding:6px 14px;cursor:pointer;font:inherit;color:var(--muted)}
.seg button.on{background:var(--accent);color:#fff}
.dash button:focus-visible,.dash select:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
select{font:inherit;padding:6px 10px;border:1px solid var(--line);border-radius:8px;background:var(--card)}
.chart{width:100%;height:auto;display:block}
.chart-line{fill:none;stroke:var(--accent);stroke-width:2.5}.chart-area{fill:var(--accent);opacity:.1}
.chart-dot{fill:var(--card);stroke:var(--accent);stroke-width:2}
table{width:100%;border-collapse:collapse;margin-top:8px}
th,td{text-align:left;padding:10px 8px;border-bottom:1px solid var(--line);font-size:.9rem}
th{color:var(--muted);font-weight:500}
.pill{padding:2px 10px;border-radius:99px;font-size:.78rem;text-transform:capitalize}
.pill.healthy{background:#dcfce7;color:var(--good)}.pill.degraded{background:#fef3c7;color:var(--warn)}.pill.down{background:#fee2e2;color:var(--bad)}
@media (max-width:600px){.dash{padding:12px}}
`;

export default Dashboard;