"use client";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  LinearProgress,
  Avatar,
  Grid,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { userState, coursesState, purchasedCoursesState } from "store";
import { CourseFormat } from "store";
import { useRouter } from "next/router";
import Head from "next/head";

// Icons
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import PlayCircleRounded from "@mui/icons-material/PlayCircleRounded";
import CodeRounded from "@mui/icons-material/CodeRounded";
import PsychologyRounded from "@mui/icons-material/PsychologyRounded";
import AccountTreeRounded from "@mui/icons-material/AccountTreeRounded";
import StorageRounded from "@mui/icons-material/StorageRounded";
import WebRounded from "@mui/icons-material/WebRounded";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";

// ─── Category Data ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "Web Development", icon: <WebRounded fontSize="small" />,       color: "#2563eb" },
  { label: "AI",              icon: <PsychologyRounded fontSize="small" />, color: "#7c3aed" },
  { label: "DSA",             icon: <AccountTreeRounded fontSize="small" />, color: "#059669" },
  { label: "Backend",         icon: <StorageRounded fontSize="small" />,    color: "#d97706" },
  { label: "Frontend",        icon: <CodeRounded fontSize="small" />,       color: "#db2777" },
];

// ─── Inline SVG fallback ──────────────────────────────────────────────────────
const PLACEHOLDER_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='180' viewBox='0 0 300 180'%3E%3Crect width='300' height='180' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%2394a3b8'%3ENo Image Available%3C/text%3E%3C/svg%3E";

// ─── Greeting helper ──────────────────────────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Featured Course Card ─────────────────────────────────────────────────────
function FeaturedCard({ course, onClick }: { course: CourseFormat; onClick: (id: string) => void }) {
  return (
    <Card
      sx={{
        width: 280,
        flexShrink: 0,
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.22s ease, box-shadow 0.22s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
        },
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardMedia
        component="img"
        height={160}
        image={course.imageLink || PLACEHOLDER_SRC}
        alt={course.title}
        sx={{ objectFit: "cover", flexShrink: 0 }}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = PLACEHOLDER_SRC;
        }}
      />
      <CardContent sx={{ p: 2, flexGrow: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            lineHeight: 1.3,
            mb: 0.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          ₹{course.price}
        </Typography>
        <Chip
          label={course.published ? "Published" : "Draft"}
          size="small"
          color={course.published ? "success" : "default"}
          sx={{ fontWeight: 700, fontSize: "0.68rem", height: 20 }}
        />
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          size="small"
          onClick={() => onClick(course._id)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.82rem",
            boxShadow: "none",
            "&:hover": { boxShadow: "0 4px 12px rgba(37,99,235,0.25)" },
          }}
        >
          View Course
        </Button>
      </CardActions>
    </Card>
  );
}

// ─── Continue Learning Card ───────────────────────────────────────────────────
function ContinueCard({
  course,
  progress,
  onClick,
}: {
  course: CourseFormat;
  progress: number;
  onClick: (id: string) => void;
}) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
        "&:hover": { boxShadow: "0 8px 24px rgba(0,0,0,0.09)" },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2.5 }}>
        {/* Thumbnail */}
        <Box
          component="img"
          src={course.imageLink || PLACEHOLDER_SRC}
          alt={course.title}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = PLACEHOLDER_SRC;
          }}
          sx={{
            width: 72,
            height: 72,
            borderRadius: 2,
            objectFit: "cover",
            flexShrink: 0,
          }}
        />

        {/* Content */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {course.title}
          </Typography>

          {/* Progress bar */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1, mb: 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                flexGrow: 1,
                height: 7,
                borderRadius: 4,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                },
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", minWidth: 32 }}>
              {progress}%
            </Typography>
          </Stack>

          <Button
            variant="text"
            size="small"
            endIcon={<ArrowForwardRounded fontSize="small" />}
            onClick={() => onClick(course._id)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.8rem",
              p: 0,
              color: "primary.main",
              "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
            }}
          >
            Continue →
          </Button>
        </Box>
      </Stack>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UserHome() {
  const router = useRouter();
  const user = useRecoilValue(userState);
  // Read from centralized Recoil state — populated once by InitCourses / InitPurchasedCourses in _app.tsx
  const { courses: featuredCourses } = useRecoilValue(coursesState);
  const { courses: myCourses } = useRecoilValue(purchasedCoursesState);

  const displayName = user.userName
    ? user.userName.charAt(0).toUpperCase() + user.userName.slice(1)
    : "Learner";

  function goToCourse(id: string) {
    router.push(`/user/course/${id}`);
  }

  // Static progress per purchased course (40% placeholder)
  const STATIC_PROGRESS = 40;

  return (
    <>
      <Head>
        <title>Home — Coursecean</title>
        <meta name="description" content="Your personalised learning dashboard on Coursecean." />
      </Head>

      <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", pb: 8 }}>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)",
            pt: { xs: 6, md: 8 },
            pb: { xs: 6, md: 9 },
            px: 2,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 80% 60% at 60% 0%, rgba(124,58,237,0.35) 0%, transparent 60%)",
              pointerEvents: "none",
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: "relative" }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  width: 44,
                  height: 44,
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  border: "2px solid rgba(255,255,255,0.4)",
                }}
              >
                {displayName.charAt(0)}
              </Avatar>
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                👋 Welcome back, {displayName}
              </Typography>
            </Stack>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                mb: 1.5,
                fontSize: { xs: "2rem", md: "2.75rem" },
                fontFamily: "Inter, Roboto, sans-serif",
              }}
            >
              {getGreeting()}!<br />
              Continue your learning journey.
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: "rgba(255,255,255,0.75)", mb: 3.5, maxWidth: 480 }}
            >
              Explore thousands of courses taught by industry experts and level up your skills today.
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push("/user/courses")}
                endIcon={<ArrowForwardRounded />}
                sx={{
                  bgcolor: "#ffffff",
                  color: "#1e3a8a",
                  fontWeight: 700,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  px: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  "&:hover": {
                    bgcolor: "#f1f5ff",
                    transform: "translateY(-1px)",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Browse Courses
              </Button>

              {myCourses.length > 0 && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => router.push("/user/mycourses")}
                  startIcon={<PlayCircleRounded />}
                  sx={{
                    borderColor: "rgba(255,255,255,0.5)",
                    color: "#ffffff",
                    fontWeight: 600,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    px: 3,
                    "&:hover": {
                      borderColor: "#ffffff",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  My Learning
                </Button>
              )}
            </Stack>

            {/* Decorative floating shapes */}
            <Box
              sx={{
                position: "absolute",
                right: { xs: -40, md: 60 },
                top: { xs: 20, md: 0 },
                width: { xs: 160, md: 260 },
                height: { xs: 160, md: 260 },
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                display: { xs: "none", sm: "block" },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                right: { xs: -20, md: 120 },
                top: { xs: 60, md: 60 },
                width: { xs: 80, md: 140 },
                height: { xs: 80, md: 140 },
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
                display: { xs: "none", sm: "block" },
              }}
            />
          </Container>
        </Box>

        {/* ── Categories ─────────────────────────────────────────────────── */}
        <Container maxWidth="lg" sx={{ mt: 5 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "text.primary", mb: 2.5, letterSpacing: "-0.02em" }}
          >
            Categories
          </Typography>

          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            {CATEGORIES.map(({ label, icon, color }) => (
              <Chip
                key={label}
                icon={
                  <Box sx={{ color: `${color} !important`, display: "flex", alignItems: "center" }}>
                    {icon}
                  </Box>
                }
                label={label}
                onClick={() => router.push("/user/courses")}
                sx={{
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  borderRadius: 2,
                  px: 0.5,
                  py: 2.5,
                  bgcolor: `${color}12`,
                  color: color,
                  border: `1.5px solid ${color}30`,
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  "&:hover": {
                    bgcolor: `${color}22`,
                    transform: "translateY(-2px)",
                    boxShadow: `0 4px 12px ${color}30`,
                  },
                  "& .MuiChip-icon": { color: `${color} !important` },
                }}
              />
            ))}
          </Stack>
        </Container>

        {/* ── Featured Courses ────────────────────────────────────────────── */}
        <Container maxWidth="lg" sx={{ mt: 6 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "text.primary", letterSpacing: "-0.02em" }}
            >
              Featured Courses
            </Typography>
            <Button
              variant="text"
              endIcon={<ArrowForwardRounded fontSize="small" />}
              onClick={() => router.push("/user/courses")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "primary.main",
                fontSize: "0.85rem",
              }}
            >
              View all
            </Button>
          </Stack>

          {featuredCourses.length === 0 ? (
            /* Empty state */
            <Box
              sx={{
                bgcolor: "background.paper",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 3,
                py: 7,
                textAlign: "center",
              }}
            >
              <SchoolRounded sx={{ fontSize: 48, color: "text.disabled", mb: 1.5 }} />
              <Typography variant="body1" color="text.secondary" fontWeight={500}>
                No courses available yet. Check back soon!
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                gap: 2.5,
                overflowX: "auto",
                pb: 1,
                /* Hide scrollbar but keep scroll functionality */
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {featuredCourses.slice(0, 6).map((course) => (
                <FeaturedCard key={course._id} course={course} onClick={goToCourse} />
              ))}
            </Box>
          )}
        </Container>

        {/* ── Continue Learning ───────────────────────────────────────────── */}
        {myCourses.length > 0 && (
          <Container maxWidth="lg" sx={{ mt: 6 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <TrendingUpRounded sx={{ color: "primary.main" }} />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "text.primary", letterSpacing: "-0.02em" }}
                >
                  Continue Learning
                </Typography>
              </Stack>
              {myCourses.length > 3 && (
                <Button
                  variant="text"
                  endIcon={<ArrowForwardRounded fontSize="small" />}
                  onClick={() => router.push("/user/mycourses")}
                  sx={{ textTransform: "none", fontWeight: 600, color: "primary.main", fontSize: "0.85rem" }}
                >
                  View all
                </Button>
              )}
            </Stack>

            <Grid container spacing={2.5}>
              {myCourses.slice(0, 3).map((course) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course._id}>
                  <ContinueCard
                    course={course}
                    progress={STATIC_PROGRESS}
                    onClick={goToCourse}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        )}

        {/* ── Empty state when no purchased courses ──────────────────────── */}
        {myCourses.length === 0 && (
          <Container maxWidth="lg" sx={{ mt: 6 }}>
            <Box
              sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: { xs: 4, md: 5 },
                textAlign: "center",
                background: "linear-gradient(135deg, #f0f7ff 0%, #f5f0ff 100%)",
              }}
            >
              <PlayCircleRounded sx={{ fontSize: 52, color: "#2563eb", mb: 1.5, opacity: 0.8 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
                Start your learning journey
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 380, mx: "auto" }}>
                You haven't enrolled in any courses yet. Browse our catalogue and find something you love!
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push("/user/courses")}
                endIcon={<ArrowForwardRounded />}
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                  px: 3.5,
                  boxShadow: "none",
                  "&:hover": { boxShadow: "0 4px 16px rgba(37,99,235,0.25)" },
                }}
              >
                Browse Courses
              </Button>
            </Box>
          </Container>
        )}
      </Box>
    </>
  );
}