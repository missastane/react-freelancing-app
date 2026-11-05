import React, { useState } from "react";
import {
  Alert,
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
import { useLogin } from "../../hooks/auth/useLogin";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    mutate,
    isPending,
    isError,
    error,
    isSuccess,
  } = useLogin();

  const onSubmit = (e) => {
    e.preventDefault();

    mutate({
      email,
      password,
    });
  };

  const errorMessage =
    error?.response?.data?.message ||
    "Something went wrong. Please try again.";

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back. Enter your details to access your dashboard."
    >
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.2}>
          <TextField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShow((s) => !s)}
                    edge="end"
                    type="button"
                  >
                    {show ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {isError && (
            <Alert severity="error">
              {errorMessage}
            </Alert>
          )}

          {isSuccess && (
            <Alert severity="success">
              Login successful! Your credentials have been verified.
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<Typography variant="body2">Remember me</Typography>}
            />

            <Link href="/auth/forgot" underline="hover" sx={{ fontSize: 13 }}>
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            size="large"
            variant="contained"
            sx={{ py: 1.2 }}
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>

          <Divider sx={{ my: 0.5 }}>or</Divider>

          <Button
            type="button"
            size="large"
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ py: 1.1 }}
            onClick={() => console.log("google sign-in placeholder")}
          >
            Continue with Google
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", mt: 1 }}
          >
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