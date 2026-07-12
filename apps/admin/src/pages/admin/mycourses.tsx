import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Coursecard} from "ui";
import { useRouter } from "next/router";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.log("No token found");

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
      }
    };

    fetchCourses();
  }, []);
  function onClick(courseid: string) {
    router.push(`/admin/course/${courseid}`);
  }
  if (courses.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          padding: "20px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => router.push("/addcourses")}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          Add New Course
        </button>
        Radhe Radhe, No Courses Found
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
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => router.push("/admin/addcourses")}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          Add New Course
        </button>
      </div>

      <Coursecard courses={courses} onClick={onClick} />
    </div>
  );
}
