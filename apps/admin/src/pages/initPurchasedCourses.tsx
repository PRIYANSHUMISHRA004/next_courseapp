import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Cookies from "js-cookie";
import axios from "axios";
import { userState, purchasedCoursesState } from "store";

export default function InitPurchasedCourses() {
  const user = useRecoilValue(userState);
  const setPurchased = useSetRecoilState(purchasedCoursesState);

  useEffect(() => {
    if (user.isLoading) return;

    const token = Cookies.get("token");

    if (!token || !user.userName) {
      setPurchased({ courses: [], isLoading: false });
      return;
    }

    async function init() {
      try {
        const res = await axios.get("/api/user/mycourse", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPurchased({
          courses: res.data.courses || [],
          isLoading: false,
        });
      } catch (err) {
        console.error("InitPurchasedCourses: failed to load purchased courses", err);
        setPurchased({ courses: [], isLoading: false });
      }
    }

    init();
  }, [user.isLoading, user.userName, setPurchased]);

  return null;
}
