import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { adminState, coursesState } from "store";
import SignupPage from "./signup";
import Cookies from "js-cookie";
import axios from "axios";
import {
  Container,
  Stack,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Box,
  Paper,
  Chip,
} from "@mui/material";
import { useRouter } from "next/router";
import Head from "next/head";
import { Coursecard } from "ui";

// Icons
import AddRounded from "@mui/icons-material/AddRounded";
import BookRounded from "@mui/icons-material/BookRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import LayersRounded from "@mui/icons-material/LayersRounded";

// Helper: returns a time-based greeting with emoji (no external libraries)
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning ☀️";
  if (hour >= 12 && hour < 17) return "Good Afternoon 🌤️";
  if (hour >= 17 && hour < 21) return "Good Evening 🌆";
  return "Good Night 🌙";
}

// Helper: capitalizes the first letter of a string; falls back to "Admin"
function capitalizeFirst(str: string | null | undefined): string {
  if (!str) return "Admin";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Home() {
  const admin = useRecoilValue(adminState);
  const [coursesData, setCoursesData] = useRecoilState(coursesState);
  const router = useRouter();

  useEffect(() => {
    if (!admin.userName) return;

    async function fetchCourses() {
      try {
        const token = Cookies.get("token");
        if (!token) return;

        const res = await axios.get("/api/admin/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCoursesData({
          courses: res.data.courses || [],
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to fetch admin courses:", error);
        setCoursesData({
          courses: [],
          isLoading: false,
        });
      }
    }

    fetchCourses();
  }, [admin.userName, setCoursesData]);

  if (admin.isLoading || (admin.userName !== null && coursesData.isLoading)) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (admin.userName === null) {
    return (
      <>
        <Head>
          <title>Admin Portal | Coursecean</title>
          <meta name="description" content="Welcome to the Coursecean Instructor and Administrator Portal." />
        </Head>

        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "grey.50",
            backgroundImage: `
              radial-gradient(circle at 50% 0%, rgba(25, 118, 210, 0.05) 0%, transparent 50%),
              radial-gradient(rgba(15, 23, 42, 0.03) 1.2px, transparent 1.2px)
            `,
            backgroundSize: "100% 100%, 24px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            px: 2,
          }}
        >
          <Container maxWidth="md">
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                bgcolor: "background.paper",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.04)",
                textAlign: "center",
              }}
            >
              <Stack spacing={4} alignItems="center">
                <Box
                  sx={{
                    bgcolor: "rgba(37, 99, 235, 0.08)",
                    color: "primary.main",
                    p: 2,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                  }}
                >
                  <SchoolRounded sx={{ fontSize: 50 }} />
                </Box>

                <Stack spacing={1.5}>
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: 800,
                      color: "text.primary",
                      letterSpacing: "-0.03em",
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                    }}
                  >
                    Coursecean Secure Admin Portal
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.6 }}
                  >
                    Welcome to the central instructor command console. Log in or create an account to start designing, pricing, and publishing your online courses.
                  </Typography>
                </Stack>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ width: "100%", justifyContent: "center", maxWidth: 400 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={() => router.push("/admin/login")}
                    sx={{
                      borderRadius: 2.5,
                      py: 1.5,
                      textTransform: "none",
                      fontWeight: 700,
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                    }}
                  >
                    Sign In to Portal
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={() => router.push("/admin/signup")}
                    sx={{
                      borderRadius: 2.5,
                      py: 1.5,
                      textTransform: "none",
                      fontWeight: 700,
                    }}
                  >
                    Create Account
                  </Button>
                </Stack>

                <Divider sx={{ width: "100%", my: 2 }} />

                <Grid container spacing={3} sx={{ textAlign: "left" }}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                        Curriculum Editor
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        Draft comprehensive lesson contents, set flexible pricing, and manage course statuses.
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                        Secure console
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        Access is locked behind strict JWT credentials verification keeping user profiles confidential.
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                        Responsive workspace
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        Tailored specifically for administrative curation layout based on best-practice SaaS guidelines.
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>
          </Container>
        </Box>
      </>
    );
  }

  const recentCourses = [...coursesData.courses].reverse().slice(0, 3);

  return (
    <>
      <Head>
        <title>Dashboard | Admin Portal</title>
        <meta name="description" content="Manage your courses, view course catalog, and edit learning paths." />
      </Head>

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "grey.50",
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(25, 118, 210, 0.05) 0%, transparent 50%),
            radial-gradient(rgba(15, 23, 42, 0.03) 1.2px, transparent 1.2px)
          `,
          backgroundSize: "100% 100%, 24px 24px",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            
            {/* Hero Section */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
            >
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    color: "text.primary",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {getGreeting()}, {capitalizeFirst(admin.userName)} 👋
                </Typography>
                <Typography
                  variant="h6"
                  component="p"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  Welcome back!
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  Manage your courses, publish new content and grow your learning platform.
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddRounded />}
                onClick={() => router.push("/admin/addcourses")}
                sx={{
                  borderRadius: 2.5,
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)",
                }}
              >
                Add Course
              </Button>
            </Stack>

            <Divider />

            {/* Quick Action Cards Section */}
            <Grid container spacing={3}>
              {/* Card 1: My Courses */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3.5, bgcolor: "background.paper" }}>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      My Courses
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      {/* TODO: display course count once coursesData.courses is available */}
                      {coursesData.courses
                        ? `You currently manage ${coursesData.courses.length} courses.`
                        : "Browse and review all course materials, descriptions, and pricing details."}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                    {/* TODO:
                        Temporary route.
                        This currently redirects to /admin/mycourses.
                        Later it should navigate to /admin/courses, which will display all courses.
                        My Courses will remain a page showing only the logged-in admin's courses. */}
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => router.push("/admin/mycourses")}
                      sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
                    >
                      View Courses
                    </Button>
                  </CardActions>
                </Card>
              </Grid>

              {/* Card 2: Create Course */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3.5, bgcolor: "background.paper" }}>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      Create Course
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      Draft a new course curriculum with customizable lessons, pricing and statuses.
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => router.push("/admin/addcourses")}
                      sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
                    >
                      Add Course
                    </Button>
                  </CardActions>
                </Card>
              </Grid>

              {/* Card 3: Draft Courses */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3.5, bgcolor: "background.paper" }}>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      Draft Courses
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      Inspect, configure, and publish your draft materials to student catalog.
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => router.push("/admin/mycourses")}
                      sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
                    >
                      Manage
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>

            <Divider />

            {/* Recent Courses Section */}
            <Stack spacing={3}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                Recent Courses
              </Typography>

              {coursesData.courses.length === 0 ? (
                /* Professional Empty State */
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 4, md: 8 },
                    textAlign: "center",
                    borderRadius: 4,
                    bgcolor: "background.paper",
                    borderStyle: "dashed",
                    borderColor: "divider",
                    borderWidth: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SchoolRounded
                    sx={{
                      fontSize: 60,
                      color: "primary.main",
                      mb: 2,
                      opacity: 0.8,
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    You haven't created any courses yet.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddRounded />}
                    onClick={() => router.push("/admin/addcourses")}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: 600,
                      px: 4,
                      py: 1,
                    }}
                  >
                    Create your first course
                  </Button>
                </Paper>
              ) : (
                /* Course Card List */
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "flex-start",
                      gap: 2,
                    }}
                  >
                    <Coursecard
                      courses={recentCourses}
                      onClick={(courseId) => router.push(`/admin/course/${courseId}`)}
                    />
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      endIcon={<ArrowForwardRounded />}
                      onClick={() => router.push("/admin/courses")}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2.5,
                        fontWeight: 600,
                        px: 4,
                        py: 1.2,
                      }}
                    >
                      View All Courses
                    </Button>
                  </Box>
                </Box>
              )}
            </Stack>

          </Stack>
        </Container>
      </Box>
    </>
  );
}