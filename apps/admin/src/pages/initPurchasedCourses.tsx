import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Cookies from "js-cookie";
import axios from "axios";
import { userState, purchasedCoursesState } from "store";

/**
 * Side-effect-only component.
 * Fetches the authenticated user's purchased courses and writes them into
 * purchasedCoursesState. Re-runs whenever userName changes (login / logout).
 * Mount this in _app.tsx for all /user/* routes.
 */
export default function InitPurchasedCourses() {
  const user = useRecoilValue(userState);
  const setPurchased = useSetRecoilState(purchasedCoursesState);

  useEffect(() => {
    // Don't run while the auth check is still in flight
    if (user.isLoading) return;

    const token = Cookies.get("token");

    if (!token || !user.userName) {
      // Not logged in — clear purchased courses immediately
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
  // Re-run when login state changes
  }, [user.isLoading, user.userName, setPurchased]);

  return null;
}
