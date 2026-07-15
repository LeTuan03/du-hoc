/** Biểu đồ SVG server-render — không cần thư viện chart phía client */

export function LineChart({
  points,
  labels,
  height = 220,
}: {
  points: number[];
  labels: string[];
  height?: number;
}) {
  const width = 640;
  const padding = { top: 16, right: 12, bottom: 28, left: 32 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const max = Math.max(...points, 1);

  const x = (i: number) =>
    padding.left + (points.length <= 1 ? 0 : (i / (points.length - 1)) * innerW);
  const y = (v: number) => padding.top + innerH - (v / max) * innerH;

  const path = points
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ");
  const area = `${path} L${x(points.length - 1).toFixed(1)},${padding.top + innerH} L${padding.left},${padding.top + innerH} Z`;

  const gridLines = [0.25, 0.5, 0.75, 1].map((f) => ({
    y: padding.top + innerH - f * innerH,
    value: Math.round(max * f),
  }));

  // Hiển thị tối đa 6 nhãn trục X
  const labelStep = Math.max(1, Math.ceil(labels.length / 6));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label="Biểu đồ lead theo ngày"
    >
      {gridLines.map((g, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={g.y}
            y2={g.y}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />
          <text x={padding.left - 8} y={g.y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
            {g.value}
          </text>
        </g>
      ))}
      <path d={area} fill="#1e4fa3" opacity="0.08" />
      <path d={path} fill="none" stroke="#1e4fa3" strokeWidth="2.5" strokeLinejoin="round" />
      {points.map((v, i) =>
        v > 0 ? (
          <circle key={i} cx={x(i)} cy={y(v)} r="3" fill="#1e4fa3" />
        ) : null,
      )}
      {labels.map((label, i) =>
        i % labelStep === 0 ? (
          <text
            key={i}
            x={x(i)}
            y={height - 8}
            textAnchor="middle"
            fontSize="10"
            fill="#94a3b8"
          >
            {label}
          </text>
        ) : null,
      )}
    </svg>
  );
}

const donutColors = [
  "#1e4fa3",
  "#f5c451",
  "#16a34a",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#ea580c",
  "#64748b",
];

export function DonutChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 80;
  const cy = 80;
  const r = 60;
  const strokeW = 26;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = data.map((d, i) => {
    const fraction = total > 0 ? d.value / total : 0;
    const seg = {
      ...d,
      color: donutColors[i % donutColors.length],
      dash: fraction * circumference,
      offset,
    };
    offset += fraction * circumference;
    return seg;
  });

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label="Biểu đồ phân bổ">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeW} />
        {segments.map((s, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={strokeW}
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={-s.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="24" fontWeight="800" fill="#0f172a">
          {total}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="10" fill="#94a3b8">
          tổng lead
        </text>
      </svg>
      <ul className="space-y-1.5 text-sm">
        {segments.map((s, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ background: s.color }} />
            <span className="text-slate-600">{s.label}</span>
            <span className="font-bold text-slate-900">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FunnelBars({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600">{d.label}</span>
            <span className="text-slate-900">{d.value}</span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: d.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
