import { Button, Card, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";


export default function AddCourse() {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    price: 0,
    imageLink: "",
    published: false,
  });

  const router = useRouter();

  const addCourse = async () => {
    try {
      const token = Cookies.get("token");

      let res=await axios.post(
        "/api/admin/createCourses",
        course,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      router.push("/admin/courses");

      setCourse({
        title: "",
        description: "",
        price: 0,
        imageLink: "",
        published: false,
      });
    } catch (err) {
      console.log(err);
      alert("Failed to create course");
    }
  };

  return (
    <Card
      sx={{
        width: 700,
        margin: "20px auto",
        padding: 3,
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
      >
        Add Course
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
        type="number"
        label="Price"
        margin="normal"
        value={course.price}
        onChange={(e) =>
          setCourse({
            ...course,
            price: Number(e.target.value),
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

      <FormControlLabel
        control={
          <Checkbox
            checked={course.published}
            onChange={(e) =>
              setCourse({
                ...course,
                published: e.target.checked,
              })
            }
          />
        }
        label="Published"
      />

      {course.imageLink && (
        <img
          src={course.imageLink}
          alt="preview"
          style={{
            width: "100%",
            marginTop: 20,
            borderRadius: 10,
          }}
        />
      )}

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={addCourse}
      >
        Add Course
      </Button>
    </Card>
  );
}