import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import Cookies from "js-cookie";
import axios from "axios";
import { userState } from "store";
export default function InitUser() {
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    async function init() {
      const token = Cookies.get("token");

      if (!token) {
        setUser({
          userName: null,
          isLoading: false,
        });
        return;
      }

      try {
        const res = await axios.get("/api/admin/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser({
          userName: res.data.name,
          isLoading: false,
        });
      } catch {
        Cookies.remove("token");

        setUser({
          userName: null,
          isLoading: false,
        });
      }
    }

    init();
  }, [setUser]);

  return null;
}