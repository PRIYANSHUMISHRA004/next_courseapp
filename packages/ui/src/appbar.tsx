"use client";
import Link from "next/link";
import {
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  Stack,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useRecoilState } from "recoil";
import { userState, adminState } from "store";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

// Icons
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";

interface AppbarProps {
  role: "admin" | "user";
}

export function Appbar({ role }: AppbarProps) {
  const router = useRouter();
  const stateAtom = role === "admin" ? adminState : userState;
  const [user, setState] = useRecoilState(stateAtom);

  const homeRoute = `/${role}/`;
  const coursesRoute = `/${role}/courses`;
  const signupRoute = `/${role}/signup`;
  const loginRoute = `/${role}/login`;

  const handleLogout = () => {
    // Reset only the role-specific Recoil atom — admin and user are separate
    setState({
      userName: null,
      isLoading: false,
    });
    // Remove the authentication token cookie
    Cookies.remove("token");
    // Redirect to the landing page (Admin/User portal chooser), not to login
    router.replace("/");
  };

  const isLoggedIn = !!user.userName;

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
          minHeight: 70,
        }}
      >
        {/* Left Side: Logo & Navigation */}
        <Stack direction="row" spacing={4} alignItems="center">
          <Link href={homeRoute} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <SchoolRounded sx={{ color: "primary.main", fontSize: "2rem" }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                letterSpacing: "-0.03em",
                fontFamily: "Inter, Roboto, sans-serif",
              }}
            >
              Coursecean{role === "admin" ? " Admin" : ""}
            </Typography>
          </Link>

          {isLoggedIn && (
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {role === "user" ? (
                // ── User nav links ──────────────────────────────────────────
                <>
                  {[
                    { label: "Home",        href: "/user/home" },
                    { label: "Courses",     href: "/user/courses" },
                    { label: "My Learning", href: "/user/mycourses" },
                    { label: "About",       href: "/user/about" },
                  ].map(({ label, href }) => (
                    <Link key={href} href={href} style={{ textDecoration: "none" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: router.pathname === href ? "primary.main" : "text.secondary",
                          "&:hover": { color: "primary.main" },
                          transition: "color 0.2s ease",
                        }}
                      >
                        {label}
                      </Typography>
                    </Link>
                  ))}
                </>
              ) : (
                // ── Admin nav links ─────────────────────────────────────────
                <>
                  <Link href={homeRoute} style={{ textDecoration: "none" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: router.pathname === homeRoute ? "primary.main" : "text.secondary",
                        "&:hover": { color: "primary.main" },
                        transition: "color 0.2s ease",
                      }}
                    >
                      Dashboard
                    </Typography>
                  </Link>
                  {/* TODO:
                      Replace this navigation with /admin/courses when the global
                      course catalog page is implemented.
                      Keep My Courses pointing to /admin/mycourses. */}
                  <Link href={`/${role}/mycourses`} style={{ textDecoration: "none" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: router.pathname === `/${role}/mycourses` ? "primary.main" : "text.secondary",
                        "&:hover": { color: "primary.main" },
                        transition: "color 0.2s ease",
                      }}
                    >
                      My Courses
                    </Typography>
                  </Link>
                  <Link href={`/${role}/addcourses`} style={{ textDecoration: "none" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: router.pathname === `/${role}/addcourses` ? "primary.main" : "text.secondary",
                        "&:hover": { color: "primary.main" },
                        transition: "color 0.2s ease",
                      }}
                    >
                      Add Course
                    </Typography>
                  </Link>
                </>
              )}
            </Stack>
          )}
        </Stack>

        {/* Center: Search Bar (only when logged in) */}
        {isLoggedIn && (
          <TextField
            size="small"
            placeholder="Search courses..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ color: "text.secondary", fontSize: "1.15rem" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              display: { xs: "none", sm: "flex" },
              width: { sm: "180px", md: "240px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                bgcolor: "grey.50",
                fontSize: "0.85rem",
                "& fieldset": { borderColor: "divider" },
                "&:hover fieldset": { borderColor: "primary.light" },
                "&.Mui-focused fieldset": { borderColor: "primary.main", bgcolor: "background.paper" },
              },
            }}
          />
        )}

        {/* Right Side: Profile Info / Auth Actions */}
        <Stack direction="row" spacing={2.5} alignItems="center">
          {isLoggedIn ? (
            <>
              {/* User Identity */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    width: 36,
                    height: 36,
                    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.15)",
                  }}
                >
                  {user.userName ? user.userName.charAt(0).toUpperCase() : (role === "admin" ? "A" : "U")}
                </Avatar>
                <Stack spacing={0.2} sx={{ display: { xs: "none", sm: "flex" } }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {user.userName}
                  </Typography>
                  <Chip
                    label={role === "admin" ? "Admin" : "User"}
                    color={role === "admin" ? "primary" : "secondary"}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      fontSize: "0.6rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      height: 18,
                      alignSelf: "flex-start",
                    }}
                  />
                </Stack>
              </Stack>

              {/* Logout Button */}
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<LogoutRounded sx={{ fontSize: "1rem" }} />}
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "divider",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: "error.light",
                    color: "error.main",
                    bgcolor: "rgba(239, 68, 68, 0.04)",
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="text"
                color="inherit"
                onClick={() => router.push(loginRoute)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  color: "text.secondary",
                  px: 2,
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push(signupRoute)}
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2.5,
                  boxShadow: "0 2px 4px rgba(37, 99, 235, 0.15)",
                }}
              >
                Create Account
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

