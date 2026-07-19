import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import axios from "axios";
import { coursesState } from "store";

/**
 * Side-effect-only component.
 * Fetches all published courses once on mount and writes them into coursesState.
 * Mount this in _app.tsx for all /user/* routes.
 * No auth required — the endpoint is public.
 */
export default function InitCourses() {
  const setCourses = useSetRecoilState(coursesState);

  useEffect(() => {
    async function init() {
      try {
        const res = await axios.get("/api/user/courses");
        setCourses({
          courses: res.data.courses || [],
          isLoading: false,
        });
      } catch (err) {
        console.error("InitCourses: failed to load courses", err);
        setCourses({ courses: [], isLoading: false });
      }
    }
    init();
  }, [setCourses]);

  return null;
}
