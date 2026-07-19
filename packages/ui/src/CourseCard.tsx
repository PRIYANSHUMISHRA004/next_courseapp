import { Button, Card, Chip, Stack, Typography } from "@mui/material";
import { CourseFormat } from "store";

export function CoursecardAdmin({
  courses,
  onClick,
}: {
  courses: CourseFormat[];
  onClick: (courseid: string) => void;
}) {
  return (
    <>
      {courses.map((course, i) => (
        <Card
          key={course._id ?? i}
          style={{
            margin: 10,
            width: 300,
            overflow: "hidden",
          }}
        >
          <img
            src={course.imageLink}
            alt={course.title}
            style={{
              width: "100%",
              height: 180,
              objectFit: "cover",
            }}
          />

          <Typography
            variant="h6"
            textAlign="center"
            style={{ marginTop: 10 }}
          >
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
            <Chip
              label={course.published ? "Published" : "Draft"}
              size="small"
              color={course.published ? "success" : "default"}
              sx={{ fontWeight: 700, fontSize: "0.7rem" }}
            />
          </Stack>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 12,
            }}
          >
            <Button
              variant="contained"
              onClick={() => onClick(course._id)}
            >
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </>
  );
}

// Inline SVG placeholder used when a course image fails to load
const PLACEHOLDER_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='180' viewBox='0 0 300 180'%3E%3Crect width='300' height='180' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%2394a3b8'%3ENo Image Available%3C/text%3E%3C/svg%3E";

export function Coursecard({
  courses,
  onClick,
}: {
  courses: CourseFormat[];
  onClick: (courseid: string) => void;
}) {
  return (
    <>
      {courses.map((course, i) => (
        <Card
          key={course._id ?? i}
          style={{
            margin: 10,
            width: 300,
            overflow: "hidden",
            // Equal-height: use flex column so all cards in the same row stretch identically
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Image with onError fallback to prevent broken-image icon */}
          <img
            src={course.imageLink}
            alt={course.title}
            style={{
              width: "100%",
              height: 180,
              objectFit: "cover",
              flexShrink: 0,
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_SRC;
            }}
          />

          <Typography
            variant="h6"
            textAlign="center"
            style={{ marginTop: 10 }}
          >
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
            <Chip
              label={course.published ? "Published" : "Draft"}
              size="small"
              color={course.published ? "success" : "default"}
              sx={{ fontWeight: 700, fontSize: "0.7rem" }}
            />
          </Stack>

          {/* Push the button to the bottom so cards with shorter titles align */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 12,
              marginTop: "auto",
            }}
          >
            <Button
              variant="contained"
              onClick={() => onClick(course._id)}
            >
              View Course
            </Button>
          </div>
        </Card>
      ))}
    </>
  );
}
