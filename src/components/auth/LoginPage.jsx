import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import AuthLayout from "./AuthLayout";

export default function LoginPage() {
  const [show, setShow] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to API
    console.log("login submit");
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back. Enter your details to access your dashboard."
    >
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.2}>
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

          <TextField
            label="Password"
            type={show ? "text" : "password"}
            placeholder="••••••••"
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

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<Typography variant="body2">Remember me</Typography>}
            />
            <Link href="/auth/forgot" underline="hover" sx={{ fontSize: 13 }}>
              Forgot password?
            </Link>
          </Box>

          <Button type="submit" size="large" variant="contained" sx={{ py: 1.2 }}>
            Sign in
          </Button>

          <Divider sx={{ my: 0.5 }}>or</Divider>

          <Button
            size="large"
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ py: 1.1 }}
            onClick={() => console.log("google sign-in placeholder")}
          >
            Continue with Google
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 1 }}>
            Don’t have an account?{" "}
            <Link href="/auth/register" underline="hover">
              Create one
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
