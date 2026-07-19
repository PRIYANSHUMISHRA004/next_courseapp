import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CourseFormat, LessonFormat } from "store";

// Icons
import AddRounded from "@mui/icons-material/AddRounded";
import DeleteRounded from "@mui/icons-material/DeleteRounded";
import KeyboardArrowUpRounded from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import SaveRounded from "@mui/icons-material/SaveRounded";
import EditRounded from "@mui/icons-material/EditRounded";

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

// ── Helpers ──────────────────────────────────────────────────────────────────

function newLesson(order: number): Omit<LessonFormat, "_id"> & { _id: string } {
  return { _id: `new_${Date.now()}`, title: "", description: "", content: "", order };
}

/** Small section label */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      sx={{
        fontWeight: 700,
        color: "text.secondary",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        display: "block",
        mb: 0.6,
      }}
    >
      {children}
    </Typography>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCoursePage() {
  const router = useRouter();
  const { id } = router.query;

  const [course, setCourse] = useState<CourseFormat | null>(null);
  // Separate state for the tags text-field (comma-separated)
  const [tagsRaw, setTagsRaw] = useState("");

  // Local lessons state — managed separately to avoid mutating course directly
  const [lessons, setLessons] = useState<LessonFormat[]>([]);
  // Which lesson _id is currently open for editing (null = none)
  const [editingId, setEditingId] = useState<string | null>(null);

  // ── Fetch course ────────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchCourse() {
      if (!id) return;
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`/api/admin/courses?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetched: CourseFormat = res.data.course;
        setCourse(fetched);
        // Populate tags text-field from the stored array
        setTagsRaw(fetched.tags?.join(", ") ?? "");
        // Sort by order so they render in the correct sequence
        const sorted = [...(fetched.lessons ?? [])].sort((a, b) => a.order - b.order);
        setLessons(sorted);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCourse();
  }, [id]);

  // ── Course update (metadata only) ──────────────────────────────────────────
  const updateCourse = async () => {
    if (!course) return;
    try {
      const token = Cookies.get("token");

      // Derive tags array from tagsRaw
      const tags = tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await axios.put(
        "/api/admin/updateCourse",
        {
          courseId: id,
          ...course,
          thumbnail: course.imageLink, // auto-derive from imageLink
          tags,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Course updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update course");
    }
  };

  // ── Delete course ───────────────────────────────────────────────────────────
  const deleteCourse = async () => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    try {
      const token = Cookies.get("token");
      await axios.delete(`/api/admin/deleteCourse?courseId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Course deleted successfully");
      router.push("/admin/courses");
    } catch (err) {
      console.error(err);
      alert("Failed to delete course");
    }
  };

  // ── Persist lessons array to DB ─────────────────────────────────────────────
  const saveLessons = async (updatedLessons: LessonFormat[]) => {
    try {
      const token = Cookies.get("token");

      // Strip temporary "new_*" ids so Mongoose can generate valid ObjectIds
      const lessonsToSave = updatedLessons.map((l) => {
        if (l._id.startsWith("new_")) {
          const { _id, ...rest } = l;
          return rest;
        }
        return l;
      });

      const res = await axios.put(
        "/api/admin/updateCourse",
        { courseId: id, lessons: lessonsToSave },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state with the returned lessons containing real database ObjectIds
      if (res.data.course?.lessons) {
        const sorted = [...res.data.course.lessons].sort((a, b) => a.order - b.order);
        setLessons(sorted);
      }
    } catch (err) {
      console.error("Failed to save lessons:", err);
      alert("Failed to save lessons");
    }
  };

  // ── Lesson: add ─────────────────────────────────────────────────────────────
  const addLesson = () => {
    const next = newLesson(lessons.length);
    const updated = [...lessons, next as LessonFormat];
    setLessons(updated);
    setEditingId(next._id);
  };

  // ── Lesson: delete ──────────────────────────────────────────────────────────
  const deleteLesson = async (lessonId: string) => {
    if (!window.confirm("Delete this lesson?")) return;
    const updated = lessons
      .filter((l) => l._id !== lessonId)
      .map((l, i) => ({ ...l, order: i }));
    setLessons(updated);
    if (editingId === lessonId) setEditingId(null);
    await saveLessons(updated);
  };

  // ── Lesson: field change ────────────────────────────────────────────────────
  const updateLesson = (lessonId: string, field: keyof LessonFormat, value: string | number) => {
    setLessons((prev) =>
      prev.map((l) => (l._id === lessonId ? { ...l, [field]: value } : l))
    );
  };

  // ── Lesson: save (persist) ──────────────────────────────────────────────────
  const saveLesson = async (lessonId: string) => {
    const lesson = lessons.find((l) => l._id === lessonId);
    if (!lesson?.title.trim()) {
      alert("Lesson title cannot be empty");
      return;
    }
    await saveLessons(lessons);
    setEditingId(null);
  };

  // ── Lesson: reorder ─────────────────────────────────────────────────────────
  const moveLesson = async (lessonId: string, direction: "up" | "down") => {
    const idx = lessons.findIndex((l) => l._id === lessonId);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === lessons.length - 1) return;

    const next = [...lessons];
    const swap = direction === "up" ? idx - 1 : idx + 1;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    // Rewrite order to match position
    const reordered = next.map((l, i) => ({ ...l, order: i }));
    setLessons(reordered);
    await saveLessons(reordered);
  };

  // ── Loading guard ───────────────────────────────────────────────────────────
  if (!course) {
    return <div><h2>Loading...</h2></div>;
  }

  // ── UI ──────────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ display: "flex", gap: 2.5, p: { xs: 2, md: 3 }, alignItems: "flex-start", flexWrap: "wrap" }}>

      {/* ══════════════════════════════════════════
          LEFT PANEL — Course metadata editor
      ══════════════════════════════════════════ */}
      <Card sx={{ flex: 1, minWidth: 300, p: 3 }}>
        <Typography variant="h5" textAlign="center" gutterBottom fontWeight={700}>
          Edit Course
        </Typography>

        <Stack spacing={2.5} sx={{ mt: 1 }}>

          {/* ── Title ── */}
          <Box>
            <FieldLabel>Title *</FieldLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Complete React Developer Bootcamp"
              value={course.title}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
            />
          </Box>

          {/* ── Description ── */}
          <Box>
            <FieldLabel>Description</FieldLabel>
            <TextField
              fullWidth
              size="small"
              multiline
              rows={3}
              placeholder="Describe what students will learn..."
              value={course.description}
              onChange={(e) => setCourse({ ...course, description: e.target.value })}
            />
          </Box>

          {/* ── Image URL ── */}
          <Box>
            <FieldLabel>Cover Image URL</FieldLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="https://example.com/image.jpg"
              value={course.imageLink}
              onChange={(e) => setCourse({ ...course, imageLink: e.target.value })}
              helperText="Also used as thumbnail automatically"
            />
          </Box>

          {/* ── Price ── */}
          <Box>
            <FieldLabel>Price (₹)</FieldLabel>
            <TextField
              fullWidth
              size="small"
              type="number"
              value={course.price}
              inputProps={{ min: 0 }}
              onChange={(e) =>
                setCourse({
                  ...course,
                  price: e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
              helperText="Set to 0 for a free course"
            />
          </Box>

          <Divider />

          {/* ── Category / Level / Language ── */}
          <Grid container spacing={1.5}>

            <Grid item xs={12}>
              <FieldLabel>Category</FieldLabel>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={course.category ?? ""}
                  onChange={(e) => setCourse({ ...course, category: e.target.value })}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FieldLabel>Level</FieldLabel>
              <FormControl fullWidth size="small">
                <InputLabel>Level</InputLabel>
                <Select
                  label="Level"
                  value={course.level ?? ""}
                  onChange={(e) =>
                    setCourse({
                      ...course,
                      level: e.target.value as CourseFormat["level"],
                    })
                  }
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {LEVELS.map((l) => (
                    <MenuItem key={l} value={l}>{l}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FieldLabel>Language</FieldLabel>
              <FormControl fullWidth size="small">
                <InputLabel>Language</InputLabel>
                <Select
                  label="Language"
                  value={course.language ?? ""}
                  onChange={(e) => setCourse({ ...course, language: e.target.value })}
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
              size="small"
              placeholder="e.g. 12 hours, 6 weeks"
              value={course.duration ?? ""}
              onChange={(e) => setCourse({ ...course, duration: e.target.value })}
            />
          </Box>

          {/* ── Tags ── */}
          <Box>
            <FieldLabel>Tags</FieldLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. react, javascript, web development"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              helperText="Comma-separated values"
            />
            {tagsRaw.trim() && (
              <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mt: 1 }}>
                {tagsRaw
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

          {/* ── Published toggle ── */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="body2" fontWeight={700}>Publish Course</Typography>
              <Typography variant="caption" color="text.secondary">
                Students can enroll once published
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={course.published}
                  onChange={(e) =>
                    setCourse({ ...course, published: e.target.checked })
                  }
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

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, borderRadius: 2.5, textTransform: "none", fontWeight: 700 }}
          onClick={updateCourse}
        >
          Update Course
        </Button>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          sx={{ mt: 2, borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}
          onClick={deleteCourse}
        >
          Delete Course
        </Button>
      </Card>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Lessons editor
      ══════════════════════════════════════════ */}
      <Card sx={{ flex: 1, minWidth: 320, p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>
            Lessons
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({lessons.length})
            </Typography>
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddRounded />}
            onClick={addLesson}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
          >
            Add Lesson
          </Button>
        </Stack>

        {lessons.length === 0 && (
          <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            No lessons yet. Click &quot;Add Lesson&quot; to create the first one.
          </Typography>
        )}

        <Stack spacing={2}>
          {lessons.map((lesson, idx) => {
            const isEditing = editingId === lesson._id;

            return (
              <Box
                key={lesson._id}
                sx={{
                  border: "1px solid",
                  borderColor: isEditing ? "primary.main" : "divider",
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                {/* ── Lesson row header ── */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ px: 2, py: 1.5, bgcolor: isEditing ? "primary.50" : "grey.50" }}
                >
                  {/* Order badge */}
                  <Typography
                    variant="caption"
                    sx={{
                      minWidth: 24,
                      height: 24,
                      bgcolor: "primary.main",
                      color: "#fff",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {lesson.title || <em style={{ color: "#999" }}>Untitled lesson</em>}
                  </Typography>

                  {/* Reorder */}
                  <Tooltip title="Move up">
                    <span>
                      <IconButton size="small" disabled={idx === 0} onClick={() => moveLesson(lesson._id, "up")}>
                        <KeyboardArrowUpRounded fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Move down">
                    <span>
                      <IconButton size="small" disabled={idx === lessons.length - 1} onClick={() => moveLesson(lesson._id, "down")}>
                        <KeyboardArrowDownRounded fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>

                  {/* Edit toggle */}
                  <Tooltip title={isEditing ? "Close" : "Edit"}>
                    <IconButton
                      size="small"
                      color={isEditing ? "primary" : "default"}
                      onClick={() => setEditingId(isEditing ? null : lesson._id)}
                    >
                      <EditRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* Delete */}
                  <Tooltip title="Delete lesson">
                    <IconButton size="small" color="error" onClick={() => deleteLesson(lesson._id)}>
                      <DeleteRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                {/* ── Expanded editor ── */}
                {isEditing && (
                  <Box sx={{ px: 2, pb: 2, pt: 1 }}>
                    <Divider sx={{ mb: 1.5 }} />

                    <TextField
                      fullWidth
                      size="small"
                      label="Lesson Title"
                      value={lesson.title}
                      onChange={(e) => updateLesson(lesson._id, "title", e.target.value)}
                      sx={{ mb: 1.5 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label="Lesson Description"
                      multiline
                      minRows={2}
                      value={lesson.description ?? ""}
                      onChange={(e) => updateLesson(lesson._id, "description", e.target.value)}
                      placeholder="A short summary of what this lesson covers"
                      sx={{ mb: 1.5 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label="Order"
                      type="number"
                      value={lesson.order}
                      inputProps={{ min: 0 }}
                      onChange={(e) => updateLesson(lesson._id, "order", Number(e.target.value))}
                      sx={{ mb: 1.5 }}
                      helperText="Lower number = earlier in list"
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label="Content (Markdown)"
                      multiline
                      minRows={6}
                      value={lesson.content}
                      onChange={(e) => updateLesson(lesson._id, "content", e.target.value)}
                      placeholder={"# Lesson Title\n\nWrite your lesson content here using **Markdown**.\n\n- Point 1\n- Point 2"}
                      sx={{ mb: 2, fontFamily: "monospace" }}
                    />

                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<SaveRounded />}
                      onClick={() => saveLesson(lesson._id)}
                      sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                    >
                      Save Lesson
                    </Button>
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>
      </Card>

      {/* ══════════════════════════════════════════
          PREVIEW PANEL — course snapshot
      ══════════════════════════════════════════ */}
      <Card sx={{ flex: 1, minWidth: 260, p: 2 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Live Preview
        </Typography>

        <img
          src={course.imageLink}
          alt={course.title}
          style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 10 }}
        />
        <Typography variant="h5" textAlign="center" sx={{ mt: 2 }} fontWeight={700}>
          {course.title}
        </Typography>
        <Typography variant="h6" textAlign="center" sx={{ mt: 0.5 }}>
          ₹{course.price}
        </Typography>
        <Typography sx={{ mt: 2 }} color="text.secondary">
          {course.description}
        </Typography>

        {/* ── Extra metadata preview ── */}
        <Stack spacing={0.5} sx={{ mt: 2 }}>
          <Typography variant="body2">
            Status: <strong>{course.published ? "Published" : "Draft"}</strong>
          </Typography>
          <Typography variant="body2">
            Lessons: <strong>{lessons.length}</strong>
          </Typography>
          {course.category && (
            <Typography variant="body2">
              Category: <strong>{course.category}</strong>
            </Typography>
          )}
          {course.level && (
            <Typography variant="body2">
              Level: <strong>{course.level}</strong>
            </Typography>
          )}
          {course.language && (
            <Typography variant="body2">
              Language: <strong>{course.language}</strong>
            </Typography>
          )}
          {course.duration && (
            <Typography variant="body2">
              Duration: <strong>{course.duration}</strong>
            </Typography>
          )}
          {/* Tags */}
          {tagsRaw.trim() && (
            <Box sx={{ mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                TAGS
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.6} sx={{ mt: 0.5 }}>
                {tagsRaw
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
                      sx={{ fontSize: "0.68rem" }}
                    />
                  ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Card>

    </Box>
  );
}