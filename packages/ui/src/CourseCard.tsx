import { Button, Card, Typography } from "@mui/material";
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

          <Typography
            variant="body1"
            textAlign="center"
            style={{ marginTop: 8, fontWeight: 600 }}
          >
            ₹{course.price}
          </Typography>

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

          <Typography
            variant="body1"
            textAlign="center"
            style={{ marginTop: 8, fontWeight: 600 }}
          >
            ₹{course.price}
          </Typography>

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
              View Course
            </Button>
          </div>
        </Card>
      ))}
    </>
  );
}
