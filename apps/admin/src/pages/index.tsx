import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Card sx={{ width: 320 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Admin Portal
          </Typography>

          <Typography sx={{ mb: 2 }}>
            Create, update and manage courses.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={() => router.push("/admin/signup")}
          >
            Continue as Admin
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ width: 320 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            User Portal
          </Typography>

          <Typography sx={{ mb: 2 }}>
            Browse and purchase available courses.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={() => router.push("/user/signup")}
          >
            Continue as User
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}