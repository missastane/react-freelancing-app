import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import AuthLayout from "./AuthLayout";

export default function RegisterPage() {
  const [show, setShow] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to API
    console.log("register submit");
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Choose your role and get started. You can complete your profile later."
    >
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.2}>
          <TextField
            label="Full name"
            placeholder="Jane Doe"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Email"
            placeholder="you@example.com"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TextField select label="Role" defaultValue="freelancer">
            <MenuItem value="freelancer">Freelancer</MenuItem>
            <MenuItem value="client">Client</MenuItem>
          </TextField>

          <TextField
            label="Password"
            type={show ? "text" : "password"}
            placeholder="At least 8 characters"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShow((s) => !s)} edge="end">
                    {show ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" size="large" variant="contained" sx={{ py: 1.2 }}>
            Create account
          </Button>

          <Divider sx={{ my: 0.5 }}>or</Divider>

          <Button
            size="large"
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ py: 1.1 }}
            onClick={() => console.log("google sign-up placeholder")}
          >
            Continue with Google
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 1 }}>
            Already have an account?{" "}
            <Link href="/auth/login" underline="hover">
              Sign in
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
