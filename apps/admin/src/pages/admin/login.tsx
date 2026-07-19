import axios from "axios";
import { Login } from "ui";
import { userData, adminState } from "store";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Grid, Typography, Stack, Box } from "@mui/material";

// Icons
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import SpeedRounded from "@mui/icons-material/SpeedRounded";
import AssignmentIndRounded from "@mui/icons-material/AssignmentIndRounded";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useSetRecoilState(adminState);

  async function onClick(data: userData): Promise<void> {
    try {
      const res = await axios.post("/api/admin/signin", data);
      const { name, token } = res.data;

      if (name) {
        setUser({
          userName: name,
          isLoading: false,
        });

        Cookies.set("token", token, {
          expires: 1,
        });

        router.push("/admin");
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        alert("Authentication failed. Invalid username or password.");
      } else {
        alert("Something went wrong. Please try again.");
      }
      console.error(error);
    }
  }

  return (
    <Grid container sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Left Column: Return Instructors Panel */}
      <Grid
        size={{ xs: 0, md: 6 }}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          bgcolor: "primary.main",
          backgroundImage: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
          color: "primary.contrastText",
          p: 6,
        }}
      >
        <Stack spacing={4} sx={{ maxWidth: 480, mx: "auto" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <SchoolRounded sx={{ fontSize: "3rem" }} />
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
              Coursecean
            </Typography>
          </Stack>
          
          <Stack spacing={2}>
            <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Welcome back, Instructor!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.85, lineHeight: 1.6 }}>
              Pick up right where you left off. Log in to manage your students, review course analytics, publish new content, and customize your learning paths.
            </Typography>
          </Stack>

          <Stack spacing={3} sx={{ mt: 2 }}>
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Box sx={{ bgcolor: "rgba(255,255,255,0.1)", p: 1, borderRadius: 2, display: "flex" }}>
                <SpeedRounded />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Instant analytics & course publishing
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Box sx={{ bgcolor: "rgba(255,255,255,0.1)", p: 1, borderRadius: 2, display: "flex" }}>
                <AssignmentIndRounded />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Manage all your students from one central workspace
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Grid>

      {/* Right Column: Login Card */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Login onClick={onClick} />
      </Grid>
    </Grid>
  );
}

