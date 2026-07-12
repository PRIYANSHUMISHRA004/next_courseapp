import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Coursecard } from "ui";

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

        const res = await axios.get("/api/user/mycourse", {
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
    router.push(`/user/course/${courseid}`);
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
        Radhe Radhe, You haven't purchased any courses yet.
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
      <Coursecard courses={courses} onClick={onClick} />
    </div>
  );
}
