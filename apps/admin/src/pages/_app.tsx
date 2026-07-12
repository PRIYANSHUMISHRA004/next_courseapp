import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import Script from "next/script";
import { Appbar } from "ui";
import InitUser from "./init";

import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");
  const isUserRoute = router.pathname.startsWith("/user");

  let appbarProps;

  if (isAdminRoute) {
    appbarProps = {
      homeRoute: "/admin/home",
      aboutRoute: "/admin/about",
      coursesRoute: "/admin/courses",
      myCoursesRoute: "/admin/mycourses",
      loginRoute: "/admin/login",
      signupRoute: "/admin/signup",
    };
  } else if (isUserRoute) {
    appbarProps = {
      homeRoute: "/user/home",
      aboutRoute: "/user/about",
      coursesRoute: "/user/courses",
      myCoursesRoute: "/user/mycourses",
      loginRoute: "/user/login",
      signupRoute: "/user/signup",
    };
  }

  return (
    <RecoilRoot>
            <Script

        src="https://checkout.razorpay.com/v1/checkout.js"

        strategy="beforeInteractive"

      />
      <InitUser apiUrl={isAdminRoute ? "/api/admin/me" : "/api/user/me"} />
      {appbarProps && <Appbar {...appbarProps} />}
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
