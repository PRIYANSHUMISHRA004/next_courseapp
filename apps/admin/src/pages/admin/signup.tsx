import axios from "axios";
import { Signup } from "ui";
import { BASE_URL,userData,userState } from "store";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import {userSignupData} from 'store'

export default function SignupPage() {
  const router = useRouter();
  const setUser = useSetRecoilState(userState);

  async function onClick(data: userSignupData): Promise<void> {
    try {
      const res = await axios.post("/api/admin/signup", data);
      const { name, token, message } = res.data;

      alert(message || "Signup successful");

      if (name) {
        setUser({
          userName: name,
          isLoading: false,
        });

        Cookies.set("token", token, {
          expires: 1,
        });

        router.push("/admin/courses");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Signup failed");
    }
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Signup onClick={onClick} />
    </div>
  );
}
