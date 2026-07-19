import { Box, Button, Card, Chip, Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CourseFormat, LessonFormat, userState, purchasedCoursesState } from "store";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Cookies from "js-cookie";

// Icons
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRounded from "@mui/icons-material/RadioButtonUncheckedRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import MenuBookRounded from "@mui/icons-material/MenuBookRounded";

// ─── Simple Markdown renderer ─────────────────────────────────────────────────
// Converts a small subset of Markdown to HTML without any extra dependency.
// Handles: # headings, **bold**, *italic*, `code`, - bullet lists, line breaks.
function renderMarkdown(md: string): string {
  return md
    // headings
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // inline code
    .replace(/`(.+?)`/g, "<code style='background:#f3f4f6;padding:2px 6px;border-radius:4px;font-family:monospace'>$1</code>")
    // bullet list items
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    // wrap consecutive <li> items in <ul>
    .replace(/((<li>.*<\/li>\n?)+)/g, "<ul style='padding-left:1.5rem;margin:8px 0'>$1</ul>")
    // double newline → paragraph break
    .replace(/\n\n/g, "</p><p>")
    // single newline → <br>
    .replace(/\n/g, "<br/>");
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserCoursePage() {
  const router = useRouter();
  const { id } = router.query;

  const [course, setCourse] = useState<CourseFormat | null>(null);
  // Sorted lesson list
  const [lessons, setLessons] = useState<LessonFormat[]>([]);
  // The lesson currently being read (null = overview)
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  // Set of lesson _ids the user has marked completed (UI-only, no backend yet)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  // ── Access Control State ────────────────────────────────────────────────────
  const user = useRecoilValue(userState);
  const { courses: purchasedCourses, isLoading: isPurchasedLoading } = useRecoilValue(purchasedCoursesState);
  const setPurchased = useSetRecoilState(purchasedCoursesState);

  const isLoggedIn = !user.isLoading && user.userName !== null;
  const isPurchased = !isPurchasedLoading && purchasedCourses.some((c) => c._id === id);
  const hasAccess = isLoggedIn && isPurchased;

  // ── Purchase Course Action — full Razorpay flow ────────────────────────────
  const buyCourse = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      // ── Step 1: Ask the backend to create a Razorpay order ─────────────────
      const orderRes = await axios.post(
        "/api/payment/create-order",
        { courseId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderId, amount, currency, keyId } = orderRes.data;

      // ── Step 2: Open the Razorpay checkout popup ────────────────────────────
      const options = {
        key: keyId,
        amount,
        currency,
        name: course?.title ?? "Course Purchase",
        description: `Purchase of ${course?.title ?? "Course"}`.slice(0, 255),
        image: course?.imageLink ?? "",
        order_id: orderId,

        // ── Step 3: On successful payment, verify on the backend ─────────────
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await axios.post(
              "/api/payment/verify-payment",
              {
                razorpay_order_id:  response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                courseId: id,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Payment successful! Course unlocked.");

            // ── Step 4: Only NOW refresh purchasedCourses in Recoil ──────────
            const myCoursesRes = await axios.get("/api/user/mycourse", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setPurchased({
              courses: myCoursesRes.data.courses || [],
              isLoading: false,
            });
          } catch (verifyErr: any) {
            console.error("Payment verification failed:", verifyErr);
            const msg =
              verifyErr?.response?.data?.message ||
              "Payment verification failed. Please contact support.";
            alert(msg);
          }
        },

        prefill: { name: user.userName ?? "" },
        theme: { color: "#1976d2" },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", (response: any) => {
        console.error("Razorpay payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err: any) {
      console.error("buyCourse error:", err);
      const msg =
        err?.response?.data?.message || "Failed to initiate payment. Please try again.";
      alert(msg);
    }
  };

  // ── Fetch course ────────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchCourse() {
      if (!id) return;
      try {
        const res = await axios.get(`/api/user/courses?id=${id}`);
        const fetched: CourseFormat = res.data.course;
        setCourse(fetched);
        const sorted = [...(fetched.lessons ?? [])].sort((a, b) => a.order - b.order);
        setLessons(sorted);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCourse();
  }, [id]);

  // ── Mark lesson as completed (UI-only placeholder) ──────────────────────────
  const markCompleted = (lessonId: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId); // toggle off
      } else {
        next.add(lessonId);
      }
      return next;
    });
  };

  // ── Loading guard ───────────────────────────────────────────────────────────
  if (!course || user.isLoading || isPurchasedLoading) {
    return <div><h2>Loading...</h2></div>;
  }

  const activeLesson = lessons.find((l) => l._id === activeLessonId) ?? null;
  const completedCount = completedIds.size;

  // ── UI ──────────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>

      {/* ══════════════════════════════════════════
          SIDEBAR — Lesson list
      ══════════════════════════════════════════ */}
      {hasAccess && (
        <Box
          sx={{
            width: { xs: "100%", md: 300 },
            flexShrink: 0,
            bgcolor: "background.paper",
            borderRight: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Course header */}
          <Box sx={{ p: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
            <Button
              startIcon={<ArrowBackRounded />}
              size="small"
              onClick={() => router.push("/user/courses")}
              sx={{ textTransform: "none", color: "text.secondary", mb: 1.5, pl: 0 }}
            >
              All Courses
            </Button>

            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>
              {course.title}
            </Typography>

            {/* Progress placeholder */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.5 }}>
              <MenuBookRounded sx={{ fontSize: "1rem", color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {completedCount} / {lessons.length} lessons completed
              </Typography>
            </Stack>

            {/* Visual progress bar placeholder */}
            <Box sx={{ mt: 1, height: 6, bgcolor: "grey.200", borderRadius: 3, overflow: "hidden" }}>
              <Box
                sx={{
                  height: "100%",
                  width: lessons.length > 0 ? `${(completedCount / lessons.length) * 100}%` : "0%",
                  bgcolor: "success.main",
                  borderRadius: 3,
                  transition: "width 0.3s ease",
                }}
              />
            </Box>
          </Box>

          {/* Lesson list */}
          {lessons.length === 0 ? (
            <Typography color="text.secondary" sx={{ p: 3, textAlign: "center" }} variant="body2">
              No lessons available yet.
            </Typography>
          ) : (
            <List disablePadding sx={{ flexGrow: 1, overflowY: "auto" }}>
              {lessons.map((lesson, idx) => {
                const done = completedIds.has(lesson._id);
                const active = activeLessonId === lesson._id;

                return (
                  <ListItemButton
                    key={lesson._id}
                    selected={active}
                    onClick={() => setActiveLessonId(lesson._id)}
                    sx={{
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      px: 2,
                      py: 1.5,
                      "&.Mui-selected": {
                        bgcolor: "primary.50",
                        borderLeft: "3px solid",
                        borderLeftColor: "primary.main",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {done ? (
                        <CheckCircleRounded sx={{ color: "success.main", fontSize: "1.2rem" }} />
                      ) : (
                        <RadioButtonUncheckedRounded sx={{ color: "text.disabled", fontSize: "1.2rem" }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={active ? 700 : 500}>
                          {idx + 1}. {lesson.title}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                );
              })}
            </List>
          )}
        </Box>
      )}

      {/* ══════════════════════════════════════════
          MAIN AREA — Overview or Lesson content
      ══════════════════════════════════════════ */}
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, overflowY: "auto" }}>

        {/* ── Course overview (no lesson selected, OR when hasAccess is false) ── */}
        {(!activeLesson || !hasAccess) && (
          <Card sx={{ maxWidth: 780, mx: "auto", p: 3 }}>
            <img
              src={course.imageLink}
              alt={course.title}
              style={{ width: "100%", height: 260, objectFit: "cover", borderRadius: 10, marginBottom: 20 }}
            />

            <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
              {course.level && <Chip label={course.level} size="small" color="primary" variant="outlined" />}
              {course.category && <Chip label={course.category} size="small" variant="outlined" />}
              {course.language && <Chip label={course.language} size="small" variant="outlined" />}
              <Chip label={`${lessons.length} Lessons`} size="small" variant="outlined" />
            </Stack>

            <Typography variant="h4" fontWeight={700} gutterBottom>
              {course.title}
            </Typography>

            <Typography variant="h6" color="text.secondary" gutterBottom>
              ₹{course.price}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography>{course.description}</Typography>

            {hasAccess && lessons.length > 0 && (
              <Button
                variant="contained"
                sx={{ mt: 3, textTransform: "none", fontWeight: 600, borderRadius: 2.5 }}
                onClick={() => setActiveLessonId(lessons[0]._id)}
              >
                Start Learning →
              </Button>
            )}

            {!isLoggedIn && (
              <Card variant="outlined" sx={{ p: 3, mt: 3, textAlign: "center", bgcolor: "primary.50", borderColor: "primary.main" }}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                  Login to purchase this course and access all lessons.
                </Typography>
                <Button variant="contained" onClick={() => router.push("/user/login")} sx={{ textTransform: "none", borderRadius: 2 }}>
                  Login
                </Button>
              </Card>
            )}

            {isLoggedIn && !isPurchased && (
              <Card variant="outlined" sx={{ p: 3, mt: 3, textAlign: "center", bgcolor: "success.50", borderColor: "success.main" }}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                  Purchase this course to unlock all lessons.
                </Typography>
                <Button variant="contained" color="success" onClick={buyCourse} sx={{ textTransform: "none", borderRadius: 2 }}>
                  Buy Course
                </Button>
              </Card>
            )}
          </Card>
        )}

        {/* ── Lesson document ── */}
        {hasAccess && activeLesson && (
          <Box sx={{ maxWidth: 780, mx: "auto" }}>

            {/* Navigation: prev / next */}
            {(() => {
              const idx = lessons.findIndex((l) => l._id === activeLesson._id);
              const prev = idx > 0 ? lessons[idx - 1] : null;
              const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;

              return (
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Button
                    disabled={!prev}
                    onClick={() => prev && setActiveLessonId(prev._id)}
                    sx={{ textTransform: "none" }}
                  >
                    ← Previous
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveLessonId(null)}
                    sx={{ textTransform: "none" }}
                  >
                    Course Overview
                  </Button>
                  <Button
                    disabled={!next}
                    onClick={() => next && setActiveLessonId(next._id)}
                    sx={{ textTransform: "none" }}
                  >
                    Next →
                  </Button>
                </Stack>
              );
            })()}

            <Card sx={{ p: { xs: 2.5, md: 4 } }}>
              {/* Lesson header */}
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                {completedIds.has(activeLesson._id) ? (
                  <CheckCircleRounded sx={{ color: "success.main", fontSize: "1.6rem" }} />
                ) : (
                  <RadioButtonUncheckedRounded sx={{ color: "text.disabled", fontSize: "1.6rem" }} />
                )}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    LESSON {lessons.findIndex((l) => l._id === activeLesson._id) + 1} OF {lessons.length}
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {activeLesson.title}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {/* Lesson description — short summary */}
              {activeLesson.description && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3, lineHeight: 1.7, fontStyle: "italic", borderLeft: "3px solid", borderLeftColor: "primary.light", pl: 2 }}
                >
                  {activeLesson.description}
                </Typography>
              )}

              {/* Lesson content — rendered Markdown */}
              {activeLesson.content ? (
                <Box
                  sx={{
                    lineHeight: 1.8,
                    fontSize: "1rem",
                    color: "text.primary",
                    "& h1,h2,h3": { mt: 2, mb: 1, fontWeight: 700 },
                    "& ul": { pl: 2.5 },
                    "& code": { fontFamily: "monospace" },
                  }}
                  dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(activeLesson.content)}</p>` }}
                />
              ) : (
                <Typography color="text.secondary" fontStyle="italic">
                  This lesson has no content yet.
                </Typography>
              )}

              <Divider sx={{ mt: 4, mb: 2 }} />

              {/* Mark as Completed button */}
              <Button
                variant={completedIds.has(activeLesson._id) ? "outlined" : "contained"}
                color="success"
                sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2.5, px: 4 }}
                startIcon={
                  completedIds.has(activeLesson._id)
                    ? <CheckCircleRounded />
                    : <RadioButtonUncheckedRounded />
                }
                onClick={() => markCompleted(activeLesson._id)}
              >
                {completedIds.has(activeLesson._id) ? "Completed ✓" : "Mark as Completed"}
              </Button>

              {/* Auto-advance to next lesson after marking complete */}
              {completedIds.has(activeLesson._id) && (() => {
                const idx = lessons.findIndex((l) => l._id === activeLesson._id);
                const next = lessons[idx + 1];
                return next ? (
                  <Button
                    variant="contained"
                    sx={{ ml: 2, textTransform: "none", fontWeight: 600, borderRadius: 2.5 }}
                    onClick={() => setActiveLessonId(next._id)}
                  >
                    Next Lesson →
                  </Button>
                ) : null;
              })()}
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
}
