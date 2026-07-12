import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import Cookies from "js-cookie";
import axios from "axios";
import { userState } from "store";

interface InitUserProps {
  apiUrl: string;
}

export default function InitUser({ apiUrl }: InitUserProps) {
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
        const res = await axios.get(apiUrl, {
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
  }, [setUser, apiUrl]);

  return null;
}