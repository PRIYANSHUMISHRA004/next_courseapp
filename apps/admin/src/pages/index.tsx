import React from "react";
import { Box, Typography, Container, Stack, GlobalStyles } from "@mui/material";
import { useRouter } from "next/router";
import Head from "next/head";
import { RoleCard } from "ui";
import AdminPanelSettingsRounded from "@mui/icons-material/AdminPanelSettingsRounded";
import SchoolRounded from "@mui/icons-material/SchoolRounded";

// Shared style constants for isolated Educational SaaS theme
const outerContainerStyle = {
  height: "100dvh",
  width: "100vw",
  maxWidth: "100%",
  maxHeight: "100dvh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  bgcolor: "grey.900", // Standard grey background for dark-slate tone
  px: { xs: 2, sm: 4 },
  py: { xs: 2, sm: 3 },
  boxSizing: "border-box",
  overflow: "hidden",
};

const headerWrapperStyle = {
  maxWidth: "600px",
  width: "100%",
  mb: { xs: 3, sm: 4 },
  textAlign: "center",
};

const mainHeadingStyle = {
  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
  fontWeight: 800,
  color: "#ffffff",
  letterSpacing: "-0.02em",
  lineHeight: 1.2,
  mb: 1.5,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const subtitleStyle = {
  color: "grey.400",
  lineHeight: 1.5,
  fontWeight: 400,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>CourseApp - One Platform. Two Experiences.</title>
        <meta
          name="description"
          content="Choose whether to manage courses as an administrator or learn as a student."
        />
      </Head>

      {/* MUI native GlobalStyles to isolate HTML/body margins and layout offsets */}
      <GlobalStyles
        styles={{
          "html, body, #__next": {
            margin: "0 !important",
            padding: "0 !important",
            width: "100vw !important",
            height: "100dvh !important",
            overflow: "hidden !important",
            backgroundColor: "#0f172a !important",
          },
        }}
      />

      <Box sx={outerContainerStyle}>
        {/* Header Section */}
        <Container maxWidth="sm" sx={headerWrapperStyle}>
          <Typography variant="h4" sx={mainHeadingStyle}>
            One Platform. Two Experiences.
          </Typography>
          <Typography variant="body1" sx={subtitleStyle}>
            Choose whether you want to manage your courses as an administrator or start learning as a student.
          </Typography>
        </Container>

        {/* Cards Wrapper */}
        <Container maxWidth="md">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
            alignItems="stretch"
          >
            {/* Administrator Card */}
            <RoleCard
              icon={<AdminPanelSettingsRounded sx={{ fontSize: "1.8rem" }} />}
              title="Administrator Portal"
              description="Create, publish and manage your courses."
              features={["Create Courses", "Update Courses", "View Analytics"]}
              buttonText="Continue as Admin"
              onClick={() => router.push("/admin/")}
              accentColor="#2563eb"
            />

            {/* Student Card */}
            <RoleCard
              icon={<SchoolRounded sx={{ fontSize: "1.8rem" }} />}
              title="Student Portal"
              description="Browse, purchase and learn from premium courses."
              features={["Browse Courses", "Purchase Courses", "Track Learning"]}
              buttonText="Continue as Student"
              onClick={() => router.push("/user/home")}
              accentColor="#0284c7"
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
}