import React, { useState } from "react";
import { Button, Menu, MenuItem, Stack, Typography } from "@mui/material";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";

const roles = [
  { key: "freelancer", label: "Freelancer" },
  { key: "employer", label: "Employer" },
];

export default function RoleSwitch({ value, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = (e) => setAnchorEl(e.currentTarget);
  const close = () => setAnchorEl(null);

  const current = roles.find((r) => r.key === value) || roles[0];

  return (
    <>
      <Button
        onClick={open}
        startIcon={<SwapHorizRoundedIcon />}
        variant="outlined"
        sx={{
          borderRadius: 999,
          fontWeight: 900,
          textTransform: "none",
        }}
      >
        {current.label}
      </Button>

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={close}>
        {roles.map((r) => (
          <MenuItem
            key={r.key}
            selected={r.key === value}
            onClick={() => {
              onChange?.(r.key);
              close();
            }}
          >
            <Stack>
              <Typography sx={{ fontWeight: 900 }}>{r.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                {r.key === "freelancer" ? "Browse jobs & manage proposals" : "Manage projects & review proposals"}
              </Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
