import { useState, useEffect } from "react";
import axios from "axios";
import { Coursecard } from "ui";

import { useRouter } from "next/router";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
const router=useRouter()
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("/api/user/courses");

        setCourses(res.data.courses || []);
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
        flexDirection: "column",
        alignItems: "center",
      }}
    >

      <Coursecard courses={courses} onClick={onClick} />
    </div>
  );
}
