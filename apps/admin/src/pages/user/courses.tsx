import { useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useRecoilValue } from "recoil";
import { userState, coursesState, purchasedCoursesState } from "store";
import { CourseFormat } from "store";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Stack,
} from "@mui/material";

// Inline SVG fallback when a course image fails to load
const PLACEHOLDER_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='180' viewBox='0 0 300 180'%3E%3Crect width='300' height='180' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%2394a3b8'%3ENo Image Available%3C/text%3E%3C/svg%3E";

export default function CoursesPage() {
  const router = useRouter();
  const user = useRecoilValue(userState);

  // Read from centralized Recoil state — no local fetches needed
  const { courses } = useRecoilValue(coursesState);
  const { courses: purchasedCourses } = useRecoilValue(purchasedCoursesState);

  // Derive the set of purchased IDs for O(1) lookup
  const purchasedIds = useMemo(
    () => new Set(purchasedCourses.map((c) => c._id)),
    [purchasedCourses]
  );

  function handleBuy(courseId: string) {
    const token = Cookies.get("token");
    if (!token) {
      // Guest — redirect to login
      router.push("/user/login");
      return;
    }
    router.push(`/user/course/${courseId}`);
  }

  if (courses.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        Radhe Radhe, No Courses Available
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "20px",
        padding: "20px",
      }}
    >
      {courses.map((course, i) => {
        const isPurchased = purchasedIds.has(course._id);

        return (
          <Card
            key={course._id ?? i}
            style={{
              margin: 10,
              width: 300,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardMedia
              component="img"
              height={180}
              image={course.imageLink || PLACEHOLDER_SRC}
              alt={course.title}
              sx={{ objectFit: "cover", flexShrink: 0 }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = PLACEHOLDER_SRC;
              }}
            />

            <CardContent sx={{ flexGrow: 1, pb: 0 }}>
              <Typography variant="h6" textAlign="center" style={{ marginTop: 4 }}>
                {course.title}
              </Typography>

              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1.5}
                style={{ marginTop: 8, padding: "0 12px" }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ₹{course.price}
                </Typography>

                {isPurchased && (
                  <Chip
                    label="Purchased"
                    size="small"
                    color="success"
                    sx={{ fontWeight: 700, fontSize: "0.7rem" }}
                  />
                )}
              </Stack>
            </CardContent>

            {/* Push button to bottom so cards align in the same row */}
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 12,
                marginTop: "auto",
              }}
            >
              {isPurchased ? (
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => router.push(`/user/course/${course._id}`)}
                >
                  Continue Learning
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => handleBuy(course._id)}
                >
                  Buy Course
                </Button>
              )}
            </Box>
          </Card>
        );
      })}
    </div>
  );
}
