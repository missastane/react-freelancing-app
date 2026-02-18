import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";

import { getSkillChipSx } from "../../utils/skillColors";

export default function ProjectCard({ project, onView }) {
  const theme = useTheme();

  const {
    title,
    description,
    postedAt,
    level,
    budgetMin,
    budgetMax,
    proposals,
    skills,
    client,
  } = project;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: theme.palette.surface.border,

        // ✅ مثل MyProjectsPage
        bgcolor: theme.palette.surface.soft,
        backgroundImage: "none",

        overflow: "hidden",
        transition: "border-color 140ms ease, background-color 140ms ease, transform 140ms ease",

        "&:hover": {
          borderColor: theme.palette.surface.borderTint,
          transform: "translateY(-1px)",
          bgcolor: theme.palette.surface.strong,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            letterSpacing: -0.3,
            mb: 1,
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 2, lineHeight: 1.8 }}
        >
          {description}
        </Typography>

        <Divider sx={{ my: 2, borderColor: theme.palette.surface.border }} />

        {/* Meta Row */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2 }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <MetaItem icon={<AccessTimeRoundedIcon fontSize="small" />} text={postedAt} />
            <MetaItem icon={<WorkOutlineRoundedIcon fontSize="small" />} text={level} />
          </Stack>

          <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap">
            <Stack direction="row" spacing={0.75} alignItems="center">
              <AttachMoneyRoundedIcon fontSize="small" />
              <Typography variant="body1" sx={{ fontWeight: 800 }}>
                ${budgetMin} – ${budgetMax}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
              <PersonOutlineRoundedIcon fontSize="small" />
              <Typography variant="body2">{proposals} Proposals</Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Skills */}
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2 }}>
          {skills.map((s) => (
            <Chip key={s} label={s} sx={getSkillChipSx(theme, s)} />
          ))}
        </Stack>

        <Divider sx={{ my: 2, borderColor: theme.palette.surface.border }} />

        {/* Footer */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Stack direction="row" spacing={1.5} alignItems="center" minWidth={0}>
            <Avatar src={client.avatar} alt={client.name} />
            <Box minWidth={0}>
              <Typography variant="body1" sx={{ fontWeight: 800 }} noWrap>
                {client.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {client.location}
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            onClick={() => onView?.(project)}
            sx={{
              borderRadius: 2.5,
              px: 2.5,
              py: 1.1,
              fontWeight: 800,
              textTransform: "none",
            }}
          >
            View Details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function MetaItem({ icon, text }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center" color="text.secondary">
      {icon}
      <Typography variant="body2">{text}</Typography>
    </Stack>
  );
}
