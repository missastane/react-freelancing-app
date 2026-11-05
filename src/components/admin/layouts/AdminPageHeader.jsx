import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Stack,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink } from "react-router-dom";

export default function AdminPageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
}) {
  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 3,
        border: 1,
        borderColor: "surface.border",
        bgcolor: "background.paper",
      }}
    >
      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 1 }}
        >
          {breadcrumbs.map((item, index) =>
            item.to ? (
              <Link
                key={index}
                component={RouterLink}
                underline="hover"
                color="text.secondary"
                to={item.to}
              >
                {item.label}
              </Link>
            ) : (
              <Typography key={index} color="text.primary">
                {item.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>

          {subtitle && (
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && <Box>{actions}</Box>}
      </Stack>
    </Box>
  );
}