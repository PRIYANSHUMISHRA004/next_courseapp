// ── Lesson subdocument type ────────────────────────────────────────────────────
export interface LessonFormat {
  _id: string;
  title: string;
  description: string; // Short summary shown above the Markdown content
  content: string;     // Full Markdown document
  order: number;
}

export interface CourseFormat {
  // ── Original fields ────────────────────────────────────────────────────────
  _id: string;
  title: string;
  description: string; // Course overview — never reused inside lessons
  price: number;
  imageLink: string;
  published: boolean;

  // ── Embedded lessons (LMS extension) ──────────────────────────────────────
  lessons?: LessonFormat[];

  // ── New optional fields ────────────────────────────────────────────────────
  thumbnail?: string;
  category?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  language?: string;
  duration?: string;
  tags?: string[];
  totalLessons?: number;
  rating?: number;
  studentsEnrolled?: number;

  // ── Timestamps (set by Mongoose) ───────────────────────────────────────────
  createdAt?: string;
  updatedAt?: string;
}