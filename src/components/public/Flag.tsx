/** Cờ quốc gia dạng SVG inline (tự chứa, không phụ thuộc mạng/emoji) */

function UnionJack({ x = 0, y = 0, w = 60, h = 40 }: { x?: number; y?: number; w?: number; h?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${w / 60},${h / 40})`}>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="3.5" />
      <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="12" />
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="7" />
    </g>
  );
}

function Star({ cx, cy, r, fill = "#fff" }: { cx: number; cy: number; r: number; fill?: string }) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
  }).join(" ");
  return <polygon points={points} fill={fill} />;
}

const flags: Record<string, React.ReactNode> = {
  my: (
    <>
      <rect width="60" height="40" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 40) / 13} width="60" height={40 / 13} fill="#B22234" />
      ))}
      <rect width="26" height={(40 / 13) * 7} fill="#3C3B6E" />
      {[6, 13, 20].map((cx) =>
        [4, 10, 16].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.4" fill="#fff" />),
      )}
    </>
  ),
  canada: (
    <>
      <rect width="60" height="40" fill="#fff" />
      <rect width="15" height="40" fill="#D80621" />
      <rect x="45" width="15" height="40" fill="#D80621" />
      <path
        d="M30 8l2 4.5 4-1.5-1 4.5 4.5 1-3 3 1.5 4-4.5-1-.8 4.5h-1.4l-.8-4.5-4.5 1 1.5-4-3-3 4.5-1-1-4.5 4 1.5z"
        fill="#D80621"
      />
    </>
  ),
  uc: (
    <>
      <rect width="60" height="40" fill="#012169" />
      <UnionJack w={30} h={20} />
      <Star cx={15} cy={30} r={4.5} />
      <Star cx={45} cy={8} r={2.6} />
      <Star cx={52} cy={16} r={2.6} />
      <Star cx={45} cy={26} r={2.6} />
      <Star cx={38} cy={16} r={2.2} />
    </>
  ),
  anh: <UnionJack />,
  "han-quoc": (
    <>
      <rect width="60" height="40" fill="#fff" />
      <circle cx="30" cy="20" r="8" fill="#CD2E3A" />
      <path d="M22 20a8 8 0 0 0 16 0 4 4 0 0 0-8 0 4 4 0 0 1-8 0z" fill="#0047A0" />
      {[
        "M10 10l6-4 M11.5 12l6-4 M13 14l6-4",
        "M44 26l6 4 M45.5 24l6 4 M47 22l6 4",
        "M10 30l6 4 M11.5 28l6 4 M13 26l6 4",
        "M44 14l6-4 M45.5 16l6-4 M47 18l6-4",
      ].map((d, i) => (
        <path key={i} d={d} stroke="#000" strokeWidth="1.6" />
      ))}
    </>
  ),
  "nhat-ban": (
    <>
      <rect width="60" height="40" fill="#fff" />
      <circle cx="30" cy="20" r="9" fill="#BC002D" />
    </>
  ),
  singapore: (
    <>
      <rect width="60" height="40" fill="#fff" />
      <rect width="60" height="20" fill="#EF3340" />
      <circle cx="12" cy="10" r="6" fill="#fff" />
      <circle cx="14.5" cy="10" r="5.4" fill="#EF3340" />
      {[
        [19, 6],
        [23.5, 9],
        [22, 14],
        [16, 14],
        [14.5, 9],
      ].map(([cx, cy], i) => (
        <Star key={i} cx={cx} cy={cy} r={1.7} />
      ))}
    </>
  ),
  "new-zealand": (
    <>
      <rect width="60" height="40" fill="#012169" />
      <UnionJack w={30} h={20} />
      {[
        [45, 8],
        [52, 15],
        [45, 22],
        [39, 15],
      ].map(([cx, cy], i) => (
        <Star key={i} cx={cx} cy={cy} r={2.8} fill="#C8102E" />
      ))}
    </>
  ),
};

export function Flag({
  country,
  className = "",
}: {
  country: string;
  className?: string;
}) {
  const flag = flags[country];
  if (!flag) return null;
  return (
    <svg
      viewBox="0 0 60 40"
      className={className}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {flag}
    </svg>
  );
}
