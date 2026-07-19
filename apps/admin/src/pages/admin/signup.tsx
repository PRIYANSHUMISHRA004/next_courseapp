import axios from "axios";
import { Signup } from "ui";
import { adminState } from "store";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { userSignupData } from "store";
import { Grid, Typography, Stack, Box } from "@mui/material";

// Icons
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import LaunchRounded from "@mui/icons-material/LaunchRounded";
import PublicRounded from "@mui/icons-material/PublicRounded";

export default function SignupPage() {
  const router = useRouter();
  const setUser = useSetRecoilState(adminState);

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

        router.push("/admin");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Signup failed");
    }
  }

  return (
    <Grid container sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Left Column: New Instructors Panel */}
      <Grid
        size={{ xs: 0, md: 6 }}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          bgcolor: "primary.main",
          backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", // Darker slate gradients for onboarding
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
              Share your knowledge with the world.
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.85, lineHeight: 1.6 }}>
              Join a global community of expert instructors. Create and sell comprehensive online courses, build your professional personal brand, and earn revenue from students around the globe.
            </Typography>
          </Stack>

          <Stack spacing={3} sx={{ mt: 2 }}>
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Box sx={{ bgcolor: "rgba(255,255,255,0.08)", p: 1, borderRadius: 2, display: "flex" }}>
                <LaunchRounded />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Build dynamic lessons with video and descriptions
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Box sx={{ bgcolor: "rgba(255,255,255,0.08)", p: 1, borderRadius: 2, display: "flex" }}>
                <PublicRounded />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Reach millions of global learners looking to level up
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Grid>

      {/* Right Column: Signup Card */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Signup onClick={onClick} />
      </Grid>
    </Grid>
  );
}

