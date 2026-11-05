import { Box } from "@mui/material";

function toPath(data, w, h, pad = 4) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(1, max - min);

  const step = (w - pad * 2) / (data.length - 1);

  return data
    .map((v, i) => {
      const x = pad + i * step;
      const y = pad + (h - pad * 2) * (1 - (v - min) / range);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export default function MiniSparkline({ data = [] }) {
  const w = 88;
  const h = 28;

  if (!data || data.length < 2) return null;

  const d = toPath(data, w, h);

  return (
    <Box sx={{ width: w, height: h, opacity: 0.9 }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </Box>
  );
}