import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import { Coursecard } from "ui";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";

// ── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Development",
  "Design",
  "Business",
  "Marketing",
  "Finance",
  "IT & Software",
  "Personal Development",
  "Photography",
  "Music",
  "Health & Fitness",
  "Other",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

const LANGUAGES = [
  "English",
  "Hindi",
  "Gujarati",
  "Tamil",
  "Telugu",
  "Marathi",
  "Bengali",
  "Kannada",
  "Malayalam",
  "Other",
];

// ── Helper ───────────────────────────────────────────────────────────────────
/** Section label above each field */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      sx={{
        fontWeight: 700,
        color: "text.secondary",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        display: "block",
        mb: 0.8,
      }}
    >
      {children}
    </Typography>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AddCourse() {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    price: 0,
    imageLink: "",
    published: false,
    category: "",
    level: "" as "" | "Beginner" | "Intermediate" | "Advanced",
    language: "",
    duration: "",
    tagsRaw: "", // comma-separated UI value
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const addCourse = async () => {
    const token = Cookies.get("token");
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    // Convert tagsRaw → string[] and derive thumbnail from imageLink
    const tags = course.tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: course.title,
      description: course.description,
      price: course.price,
      imageLink: course.imageLink,
      thumbnail: course.imageLink, // auto-derive from imageLink
      published: course.published,
      ...(course.category && { category: course.category }),
      ...(course.level && { level: course.level }),
      ...(course.language && { language: course.language }),
      ...(course.duration && { duration: course.duration }),
      ...(tags.length > 0 && { tags }),
    };

    setLoading(true);
    try {
      const res = await axios.post("/api/admin/createCourses", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const msg = res.data?.message || "Course created successfully";
      alert(msg);
      router.push("/admin/courses");

      setCourse({
        title: "",
        description: "",
        price: 0,
        imageLink: "",
        published: false,
        category: "",
        level: "",
        language: "",
        duration: "",
        tagsRaw: "",
      });
    } catch (err: any) {
      console.error("Add course error:", err);
      const serverMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create course";
      alert(`Error: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Preview card — uses the same shape Coursecard expects
  const previewCourse = [{ ...course, _id: "preview" }];

  return (
    <>
      <Head>
        <title>Create Course | Admin Portal</title>
      </Head>

      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">

          {/* ── Page Header ── */}
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
            <AutoStoriesRoundedIcon sx={{ color: "primary.main", fontSize: "2rem" }} />
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 800, color: "text.primary", letterSpacing: "-0.02em" }}
              >
                Create New Course
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                Fill in the details on the left — the preview updates live on the right.
              </Typography>
            </Box>
          </Stack>

          {/* ── Two-column layout ── */}
          <Grid container spacing={4} alignItems="flex-start">

            {/* ════════════════════════════════
                LEFT COLUMN — Form (65%)
            ════════════════════════════════ */}
            <Grid item xs={12} md={7}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  overflow: "hidden",
                }}
              >
                {/* Form header */}
                <Box sx={{ px: { xs: 3, md: 4 }, pt: { xs: 3, md: 4 }, pb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                    Course Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All fields with * are required.
                  </Typography>
                </Box>

                <Divider />

                <Stack spacing={3} sx={{ px: { xs: 3, md: 4 }, py: 3 }}>

                  {/* ── Course Title ── */}
                  <Box>
                    <FieldLabel>Course Title *</FieldLabel>
                    <TextField
                      fullWidth
                      placeholder="e.g. Complete React Developer Bootcamp"
                      value={course.title}
                      onChange={(e) => setCourse({ ...course, title: e.target.value })}
                      InputProps={{ sx: { borderRadius: 2.5 } }}
                      helperText="Give your course a clear, searchable title"
                    />
                  </Box>

                  {/* ── Description ── */}
                  <Box>
                    <FieldLabel>Description</FieldLabel>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Describe what students will learn, prerequisites, and outcomes..."
                      value={course.description}
                      onChange={(e) => setCourse({ ...course, description: e.target.value })}
                      InputProps={{ sx: { borderRadius: 2.5 } }}
                      helperText="A compelling description improves enrollment"
                    />
                  </Box>

                  {/* ── Price ── */}
                  <Box>
                    <FieldLabel>Price (₹)</FieldLabel>
                    <TextField
                      fullWidth
                      type="number"
                      placeholder="0"
                      value={course.price}
                      onChange={(e) =>
                        setCourse({ ...course, price: Number(e.target.value) })
                      }
                      InputProps={{ sx: { borderRadius: 2.5 } }}
                      helperText="Set to 0 for a free course"
                    />
                  </Box>

                  {/* ── Image URL ── */}
                  <Box>
                    <FieldLabel>Cover Image URL</FieldLabel>
                    <TextField
                      fullWidth
                      placeholder="https://example.com/course-thumbnail.jpg"
                      value={course.imageLink}
                      onChange={(e) => setCourse({ ...course, imageLink: e.target.value })}
                      InputProps={{ sx: { borderRadius: 2.5 } }}
                      helperText="Paste a direct image URL — preview updates on the right. Also used as thumbnail."
                    />
                  </Box>

                  <Divider />

                  {/* ── Category / Level / Language row ── */}
                  <Grid container spacing={2}>

                    {/* Category */}
                    <Grid item xs={12} sm={4}>
                      <FieldLabel>Category</FieldLabel>
                      <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                          label="Category"
                          value={course.category}
                          onChange={(e) =>
                            setCourse({ ...course, category: e.target.value })
                          }
                          sx={{ borderRadius: 2.5 }}
                        >
                          <MenuItem value=""><em>None</em></MenuItem>
                          {CATEGORIES.map((c) => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Level */}
                    <Grid item xs={12} sm={4}>
                      <FieldLabel>Level</FieldLabel>
                      <FormControl fullWidth>
                        <InputLabel>Level</InputLabel>
                        <Select
                          label="Level"
                          value={course.level}
                          onChange={(e) =>
                            setCourse({
                              ...course,
                              level: e.target.value as typeof course.level,
                            })
                          }
                          sx={{ borderRadius: 2.5 }}
                        >
                          <MenuItem value=""><em>None</em></MenuItem>
                          {LEVELS.map((l) => (
                            <MenuItem key={l} value={l}>{l}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Language */}
                    <Grid item xs={12} sm={4}>
                      <FieldLabel>Language</FieldLabel>
                      <FormControl fullWidth>
                        <InputLabel>Language</InputLabel>
                        <Select
                          label="Language"
                          value={course.language}
                          onChange={(e) =>
                            setCourse({ ...course, language: e.target.value })
                          }
                          sx={{ borderRadius: 2.5 }}
                        >
                          <MenuItem value=""><em>None</em></MenuItem>
                          {LANGUAGES.map((lang) => (
                            <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* ── Duration ── */}
                  <Box>
                    <FieldLabel>Duration</FieldLabel>
                    <TextField
                      fullWidth
                      placeholder="e.g. 12 hours, 6 weeks"
                      value={course.duration}
                      onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                      InputProps={{ sx: { borderRadius: 2.5 } }}
                      helperText="Estimated time to complete the course"
                    />
                  </Box>

                  {/* ── Tags ── */}
                  <Box>
                    <FieldLabel>Tags</FieldLabel>
                    <TextField
                      fullWidth
                      placeholder="e.g. react, javascript, web development"
                      value={course.tagsRaw}
                      onChange={(e) => setCourse({ ...course, tagsRaw: e.target.value })}
                      InputProps={{ sx: { borderRadius: 2.5 } }}
                      helperText="Comma-separated keywords to improve discoverability"
                    />
                    {/* Live tag chips preview */}
                    {course.tagsRaw.trim() && (
                      <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mt: 1 }}>
                        {course.tagsRaw
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ fontSize: "0.72rem" }}
                            />
                          ))}
                      </Stack>
                    )}
                  </Box>

                  <Divider />

                  {/* ── Publish Toggle ── */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                        Publish Course
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Students can enroll once the course is published
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={course.published}
                          onChange={(e) =>
                            setCourse({ ...course, published: e.target.checked })
                          }
                          color="primary"
                        />
                      }
                      label={
                        <Chip
                          label={course.published ? "Live" : "Draft"}
                          size="small"
                          color={course.published ? "success" : "default"}
                          sx={{ fontWeight: 700, fontSize: "0.7rem" }}
                        />
                      }
                      labelPlacement="start"
                      sx={{ ml: 0 }}
                    />
                  </Stack>

                </Stack>

                {/* ── Footer Actions ── */}
                <Divider />
                <Box
                  sx={{
                    px: { xs: 3, md: 4 },
                    py: 2.5,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    bgcolor: "background.paper",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => router.back()}
                    sx={{
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontWeight: 600,
                      px: 3,
                      borderColor: "divider",
                      color: "text.secondary",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={addCourse}
                    disabled={loading}
                    sx={{
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontWeight: 700,
                      px: 4,
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.18)",
                    }}
                  >
                    {loading ? "Creating..." : "Create Course"}
                  </Button>
                </Box>

              </Paper>
            </Grid>

            {/* ════════════════════════════════
                RIGHT COLUMN — Live Preview (35%)
                Sticky so it stays visible while scrolling the form.
            ════════════════════════════════ */}
            <Grid item xs={12} md={5}>
              <Box sx={{ position: "sticky", top: 24 }}>

                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    display: "block",
                    mb: 1.5,
                  }}
                >
                  Live Preview
                </Typography>

                {/* Pass the current form state as a single-item array.
                    _id is a preview stub — the course hasn't been saved yet.
                    onClick is a no-op since there's no real course to navigate to. */}
                <Coursecard
                  courses={previewCourse}
                  onClick={() => {}}
                />

              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </>
  );
}