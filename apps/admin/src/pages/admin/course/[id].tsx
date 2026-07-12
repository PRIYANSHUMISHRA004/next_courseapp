import { Button, Card, TextField, Typography, FormControlLabel, Switch } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CourseFormat } from "store";

export default function Course() {
  const router = useRouter();
  const { id } = router.query;

  const [course, setCourse] = useState<CourseFormat | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      if (!id) return;

      try {
        const token = Cookies.get("token");

        const res = await axios.get(
          `/api/admin/courses?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourse(res.data.course);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCourse();
  }, [id]);

  const updateCourse = async () => {
    if (!course) return;

    try {
      const token = Cookies.get("token");

      await axios.put(
        `/api/admin/updateCourse`,
        {
          courseId: id,
          ...course,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Course Updated Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  if (!course) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        padding: 20,
        alignItems: "flex-start",
      }}
    >
      <Card
        sx={{
          flex: 1,
          padding: 3,
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
        >
          Edit Course
        </Typography>

        <TextField
          fullWidth
          label="Title"
          margin="normal"
          value={course.title}
          onChange={(e) =>
            setCourse({
              ...course,
              title: e.target.value,
            })
          }
        />

        <TextField
          fullWidth
          label="Description"
          margin="normal"
          value={course.description}
          onChange={(e) =>
            setCourse({
              ...course,
              description: e.target.value,
            })
          }
        />

        <TextField
          fullWidth
          label="Image Link"
          margin="normal"
          value={course.imageLink}
          onChange={(e) =>
            setCourse({
              ...course,
              imageLink: e.target.value,
            })
          }
        />

        <TextField
          fullWidth
          type="number"
          label="Price (₹)"
          margin="normal"
          value={course.price}
          inputProps={{ min: 0 }}
          onChange={(e) =>
            setCourse({
              ...course,
              price: e.target.value === "" ? 0 : Number(e.target.value),
            })
          }
        />

        <FormControlLabel
          sx={{ mt: 2 }}
          control={
            <Switch
              checked={course.published}
              onChange={(e) =>
                setCourse({
                  ...course,
                  published: e.target.checked,
                })
              }
            />
          }
          label={course.published ? "Published" : "Draft"}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ marginTop: 3 }}
          onClick={updateCourse}
        >
          Update Course
        </Button>
      </Card>

      <Card
        sx={{
          flex: 1,
          padding: 2,
        }}
      >
        <Typography variant="h5" textAlign="center" gutterBottom>
          Live Preview
        </Typography>

        <img
          src={course.imageLink}
          alt={course.title}
          style={{
            width: "100%",
            height: 250,
            objectFit: "cover",
            borderRadius: 10,
          }}
        />

        <Typography
          variant="h4"
          textAlign="center"
          sx={{ marginTop: 2 }}
        >
          {course.title}
        </Typography>

        <Typography
          variant="h6"
          textAlign="center"
          sx={{ marginTop: 1 }}
        >
          ₹{course.price}
        </Typography>

        <Typography sx={{ marginTop: 2 }}>
          {course.description}
        </Typography>

        <Typography sx={{ marginTop: 2 }}>
          Status: {course.published ? "Published" : "Draft"}
        </Typography>
      </Card>
    </div>
  );
}