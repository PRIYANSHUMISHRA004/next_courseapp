import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Coursecard } from "ui";
import { useRouter } from "next/router";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import Head from "next/head";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.log("No token found");
          router.push("/admin/login");
          return;
        }

        const res = await axios.get("/api/admin/courses?mine=true", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCourses(res.data.courses);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  function onClick(courseid: string) {
    router.push(`/admin/course/${courseid}`);
  }

  // ── Loading state ──────────────────────────────────────────────────
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Typography color="text.secondary">Loading courses...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>My Courses | Admin Portal</title>
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

            {/* Header Section */}
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
                  My Courses
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  {courses.length} course{courses.length !== 1 ? "s" : ""} created by you.
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
                Add New Course
              </Button>
            </Stack>

            <Divider />

            {/* Courses Content — same layout as View Courses page */}
            {courses.length === 0 ? (
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
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Radhe Radhe — You haven&apos;t created any courses yet.
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
                  Create Course
                </Button>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  gap: 2,
                }}
              >
                <Coursecard courses={courses} onClick={onClick} />
              </Box>
            )}

          </Stack>
        </Container>
      </Box>
    </>
  );
}
