import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { purchasedCoursesState } from "store";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import PlayCircleOutlineRounded from "@mui/icons-material/PlayCircleOutlineRounded";
import { CourseFormat } from "store";


// ── Inline placeholder SVG (no external dependency) ────────────────────────
const PLACEHOLDER_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='160' viewBox='0 0 280 160'%3E%3Crect width='280' height='160' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E";

// ── Single horizontal learning card ────────────────────────────────────────
function LearningCard({
  course,
  onClick,
}: {
  course: CourseFormat;
  onClick: (id: string) => void;
}) {
  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        overflow: "hidden",
        borderRadius: 3,
        width: "100%",
        maxWidth: 860,
        transition: "box-shadow 0.25s ease, transform 0.2s ease",
        "&:hover": {
          boxShadow: 8,
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* ── Thumbnail ── */}
      <Box
        sx={{
          width: { xs: "100%", sm: 240 },
          flexShrink: 0,
          position: "relative",
        }}
      >
        <img
          src={course.imageLink || PLACEHOLDER_SRC}
          alt={course.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_SRC;
          }}
          style={{
            width: "100%",
            height: "100%",
            minHeight: 160,
            objectFit: "cover",
            display: "block",
          }}
        />
        {/* Purchased badge overlay */}
        <Chip
          label="Purchased"
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            bgcolor: "success.main",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.68rem",
            height: 22,
          }}
        />
      </Box>

      {/* ── Course info ── */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2.5, sm: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {/* Meta chips */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {course.category && (
            <Chip
              label={course.category}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: "0.7rem" }}
            />
          )}
          {course.level && (
            <Chip
              label={course.level}
              size="small"
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 600, fontSize: "0.7rem" }}
            />
          )}
          {course.totalLessons != null && course.totalLessons > 0 && (
            <Chip
              icon={<SchoolRounded sx={{ fontSize: "0.85rem !important" }} />}
              label={`${course.totalLessons} lessons`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: "0.7rem" }}
            />
          )}
        </Stack>

        {/* Title */}
        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>
          {course.title}
        </Typography>

        {/* Progress (placeholder — 0 % until backend tracks it) */}
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              0%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={0}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": { borderRadius: 3 },
            }}
          />
        </Box>

        {/* Continue Learning button — pushed to bottom */}
        <Box sx={{ mt: "auto", pt: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<PlayCircleOutlineRounded />}
            onClick={() => onClick(course._id)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2.5,
              px: 3,
            }}
          >
            Continue Learning
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MyLearningPage() {
  // Read from centralized Recoil state — populated once by InitPurchasedCourses in _app.tsx
  const { courses } = useRecoilValue(purchasedCoursesState);
  const router = useRouter();

  function onClick(courseid: string) {
    router.push(`/user/course/${courseid}`);
  }

  // ── Empty state ─────────────────────────────────────────────────────────
  if (courses.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 2,
          px: 2,
        }}
      >
        <SchoolRounded sx={{ fontSize: 64, color: "text.disabled" }} />
        <Typography variant="h6" color="text.secondary" textAlign="center">
          Radhe Radhe, You haven't purchased any courses yet.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.push("/user/courses")}
          sx={{ textTransform: "none", borderRadius: 2.5 }}
        >
          Browse Courses
        </Button>
      </Box>
    );
  }

  // ── Filled state ────────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        My Learning
        <Typography
          component="span"
          variant="body2"
          color="text.secondary"
          sx={{ ml: 1.5 }}
        >
          ({courses.length} {courses.length === 1 ? "course" : "courses"})
        </Typography>
      </Typography>

      <Stack spacing={2.5}>
        {courses.map((course, i) => (
          <LearningCard key={course._id ?? i} course={course} onClick={onClick} />
        ))}
      </Stack>
    </Box>
  );
}
