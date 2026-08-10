import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { purchasedCoursesState } from "store";
import { SchoolIcon, PlayCircleOutlineIcon } from "ui";
import { CourseFormat } from "store";
import Head from "next/head";

// ── Inline placeholder SVG ──────────────────────────────────────────────────
const PLACEHOLDER_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='160' viewBox='0 0 280 160'%3E%3Crect width='280' height='160' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E";

// ── Single horizontal learning card ────────────────────────────────────────
function LearningCard({
  course,
  onClick,
}: {
  course: CourseFormat;
  onClick: (id: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-full max-w-4xl">
      {/* ── Thumbnail ── */}
      <div className="w-full sm:w-60 shrink-0 relative">
        <img
          src={course.imageLink || PLACEHOLDER_SRC}
          alt={course.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_SRC;
          }}
          className="w-full h-full min-h-[160px] object-cover block"
        />
        {/* Purchased badge overlay */}
        <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-sm">
          Purchased
        </span>
      </div>

      {/* ── Course info ── */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-3">
        <div>
          {/* Meta chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {course.category && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-200 text-slate-700 bg-slate-50">
                {course.category}
              </span>
            )}
            {course.level && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200 text-blue-700 bg-blue-50">
                {course.level}
              </span>
            )}
            {course.totalLessons != null && course.totalLessons > 0 && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-200 text-slate-700 bg-slate-50">
                <SchoolIcon className="w-3.5 h-3.5" />
                <span>{course.totalLessons} lessons</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 leading-snug">
            {course.title}
          </h3>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Progress</span>
            <span className="font-semibold text-slate-700">0%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full w-0 transition-all"></div>
          </div>
        </div>

        {/* Continue Learning button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => onClick(course._id)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-sm transition-all active:scale-[0.99]"
          >
            <PlayCircleOutlineIcon className="w-4 h-4" />
            <span>Continue Learning</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyLearningPage() {
  const { courses } = useRecoilValue(purchasedCoursesState);
  const router = useRouter();

  function onClick(courseid: string) {
    router.push(`/user/course/${courseid}`);
  }

  return (
    <>
      <Head>
        <title>My Learning | Coursecean</title>
      </Head>

      <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          
          {courses.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-white border border-slate-200 rounded-3xl space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <SchoolIcon className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Radhe Radhe, You haven't purchased any courses yet.
              </h2>
              <p className="text-sm text-slate-500 max-w-sm">
                Explore our rich library of courses and enroll to start your learning journey.
              </p>
              <button
                type="button"
                onClick={() => router.push("/user/courses")}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-sm transition-all"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            /* Populated state */
            <div>
              <div className="flex items-baseline gap-2 mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                  My Learning
                </h1>
                <span className="text-sm text-slate-500 font-medium">
                  ({courses.length} {courses.length === 1 ? "course" : "courses"})
                </span>
              </div>

              <div className="space-y-4">
                {courses.map((course, i) => (
                  <LearningCard key={course._id ?? i} course={course} onClick={onClick} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
