import { alpha } from "@mui/material/styles";

const PALETTE = [
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#A855F7",
  "#EF4444",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#14B8A6",
  "#EC4899",
  "#8B5CF6",
  "#10B981",
];

function hashString(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// ✅ skill می‌تونه string یا object باشه
export function getSkillKey(skill) {
  if (typeof skill === "string") return skill.trim().toLowerCase();

  const key =
    (skill?.original_title || skill?.persian_title || skill?.name || "").trim().toLowerCase();

  return key || "unknown-skill";
}

export function getSkillColor(skill) {
  const key = getSkillKey(skill);
  const idx = hashString(key) % PALETTE.length;
  return PALETTE[idx];
}

export function getSkillChipSx(theme, skill) {
  const base = getSkillColor(skill);
  const isDark = theme.palette.mode === "dark";

  return {
    borderRadius: 999,
    fontWeight: 800,
    bgcolor: alpha(base, isDark ? 0.18 : 0.12),
    color: theme.palette.text.primary,
    border: "1px solid",
    borderColor: alpha(base, isDark ? 0.35 : 0.22),
  };
}
