"use client";
import Link from "next/link";
import { Typography, Button, Box } from "@mui/material";
import { useRecoilState } from "recoil";
import { userState } from "store";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useEffect } from "react";

interface AppbarProps {
  homeRoute: string;
  aboutRoute: string;
  coursesRoute: string;
  myCoursesRoute?: string;
  loginRoute: string;
  signupRoute: string;
}

export function Appbar({
  homeRoute,
  aboutRoute,
  coursesRoute,
  myCoursesRoute,
  loginRoute,
  signupRoute,
}: AppbarProps) {
  let router = useRouter();
  let [user, setState] = useRecoilState(userState);

 
  console.log("Appbar user:", user);
  if (user.userName) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", gap: 3 }}>
          <Link href={homeRoute}>Home</Link>
          <Link href={aboutRoute}>About</Link>
          <Link href={coursesRoute}>Courses</Link>
          {myCoursesRoute && <Link href={myCoursesRoute}>MyCourses</Link>}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography>{user.userName}</Typography>
          <Button
            onClick={() => {
              setState({
                userName: null,
                isLoading: false,
              });
              Cookies.remove("token");
              router.push(signupRoute);
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 2,
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Box sx={{ display: "flex", gap: 3 }}>
        <Link href={homeRoute}>Home</Link>
        <Link href={aboutRoute}>About</Link>
        <Link href={coursesRoute}>Courses</Link>
      </Box>

      <Box sx={{ display: "flex", gap: 3 }}>
        <Link href={signupRoute}>Signup</Link>
        <Link href={loginRoute}>Login</Link>
      </Box>
    </Box>
  );
}
