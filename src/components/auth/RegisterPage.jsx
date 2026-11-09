
import React, { useState } from "react";
import {
  Alert,
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

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useRegister } from "../../hooks/auth/useRegister";

export default function RegisterPage() {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    role: "2",
    password: "",
    password_confirmation: "",
  });

  const registerMutation = useRegister();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      role: Number(formData.role),
    };

    registerMutation.mutate(payload, {
      onSuccess: () => {
        navigate("/auth/verify-email", {
          state: {
            email: formData.email,
          },
        });
      },
    });
  };

  const errorMessage =
    registerMutation.error?.response?.data?.message ||
    "Something went wrong. Please try again.";

  return (
    <AuthLayout
      title="Create account"
      subtitle="Choose your role and get started. You can complete your profile later."
    >
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.2}>
          {registerMutation.isError && (
            <Alert severity="error">
              {errorMessage}
            </Alert>
          )}

          <TextField
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
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
            select
            name="role"
            label="Role"
            value={formData.role}
            onChange={handleChange}
          >
            <MenuItem value="2">Freelancer</MenuItem>
            <MenuItem value="1">Client</MenuItem>
          </TextField>

          <TextField
            name="password"
            label="Password"
            type={show ? "text" : "password"}
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShow((prev) => !prev)}
                    edge="end"
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

          <TextField
            name="password_confirmation"
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat your password"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirm((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirm ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            size="large"
            variant="contained"
            sx={{ py: 1.2 }}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Creating account..."
              : "Create account"}
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

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", mt: 1 }}
          >
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
