
import { Card, Typography } from "@mui/material";

export  function About() {
  return (
    <Card
      sx={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 4,
      }}
    >
      <Typography variant="h3" gutterBottom textAlign="center">
        About This Project
      </Typography>

      <Typography variant="body1" sx={{ marginTop: 2 }}>
        This Course Selling Platform was built as a learning project to gain
        hands-on experience with full-stack web development using Next.js,
        TypeScript, MongoDB, JWT Authentication, and Material UI.
      </Typography>

      <Typography variant="body1" sx={{ marginTop: 2 }}>
        The project allows administrators to sign up, sign in, create courses,
        update courses, and manage their content through a secure dashboard.
        Users can browse available courses and interact with the platform.
      </Typography>

      <Typography variant="body1" sx={{ marginTop: 2 }}>
        While building this project, I learned API development, database design,
        authentication using JWT, protected routes, state management, dynamic
        routing, and frontend-backend integration in Next.js.
      </Typography>

      <Typography variant="body1" sx={{ marginTop: 2 }}>
        The main goal of this project was not only to build a working
        application but also to understand how modern web applications are
        structured and deployed in real-world environments.
      </Typography>
    </Card>
  );
}