import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";
import type { LoginProps } from "store";

export function Login({
  onClick,
  title = "Sign In",
  subtitle = "Continue to your account.",
  buttonText = "Sign In",
  signupText = "Don't have an account?",
  onSignupClick,
}: LoginProps) {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 420,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        p: { xs: 3, sm: 4.5 },
        boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={3.5}>

        {/* Header */}
        <Stack spacing={0.75}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "text.primary", letterSpacing: "-0.02em" }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            {subtitle}
          </Typography>
        </Stack>

        {/* Form Fields */}
        <Stack spacing={2}>
          {/* Username */}
          <TextField
            fullWidth
            label="Username"
            value={username}
            autoComplete="username"
            onChange={(e) => setName(e.target.value)}
            InputProps={{ sx: { borderRadius: 2.5 } }}
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              sx: { borderRadius: 2.5 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                    tabIndex={-1}
                  >
                    {showPassword
                      ? <VisibilityOffRounded sx={{ fontSize: "1.15rem", color: "text.secondary" }} />
                      : <VisibilityRounded sx={{ fontSize: "1.15rem", color: "text.secondary" }} />
                    }
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {/* Submit Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={() => onClick({ username, password })}
          sx={{
            height: 48,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.95rem",
            boxShadow: "0 2px 12px rgba(37, 99, 235, 0.2)",
            "&:hover": {
              boxShadow: "0 4px 16px rgba(37, 99, 235, 0.28)",
            },
          }}
        >
          {buttonText}
        </Button>

        {/* Footer */}
        {onSignupClick && (
          <>
            <Divider>
              <Typography variant="caption" color="text.disabled" sx={{ px: 1 }}>
                or
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" component="span">
                {signupText}{" "}
              </Typography>
              <Link
                component="button"
                variant="body2"
                onClick={onSignupClick}
                underline="hover"
                sx={{ fontWeight: 700, color: "primary.main", cursor: "pointer" }}
              >
                Sign Up
              </Link>
            </Box>
          </>
        )}

      </Stack>
    </Paper>
  );
}
