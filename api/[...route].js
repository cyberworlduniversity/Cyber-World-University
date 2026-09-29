const loaders = {
  "admin/assessment-analytics": () => import("../server/api/admin/assessment-analytics.js"),
  "admin/certificates": () => import("../server/api/admin/certificates.js"),
  "admin/dashboard": () => import("../server/api/admin/dashboard.js"),
  "admin/exams": () => import("../server/api/admin/exams.js"),
  "admin/questions": () => import("../server/api/admin/questions.js"),
  "admin/quizzes": () => import("../server/api/admin/quizzes.js"),
  "admin/students": () => import("../server/api/admin/students.js"),
  "auth/admin-login": () => import("../server/api/auth/admin-login.js"),
  "auth/login": () => import("../server/api/auth/login.js"),
  "auth/logout": () => import("../server/api/auth/logout.js"),
  "auth/me": () => import("../server/api/auth/me.js"),
  "auth/register": () => import("../server/api/auth/register.js"),
  "certificates/verify": () => import("../server/api/certificates/verify.js"),
  "course-content": () => import("../server/api/course-content.js"),
  "courses": () => import("../server/api/courses.js"),
  "db-health": () => import("../server/api/db-health.js"),
  "health": () => import("../server/api/health.js"),
  "quizzes": () => import("../server/api/quizzes.js"),
  "version": () => import("../server/api/version.js"),
  "student/assessment-history": () => import("../server/api/student/assessment-history.js"),
  "student/certificate": () => import("../server/api/student/certificate.js"),
  "student/dashboard": () => import("../server/api/student/dashboard.js"),
  "student/enrollments": () => import("../server/api/student/enrollments.js"),
  "student/exam": () => import("../server/api/student/exam.js"),
  "student/profile": () => import("../server/api/student/profile.js"),
  "student/progress": () => import("../server/api/student/progress.js"),
  "student/quiz-results": () => import("../server/api/student/quiz-results.js"),
  "student/quiz": () => import("../server/api/student/quiz.js")
};

export default async function handler(request, response) {
  const pathname = new URL(request.url, "http://localhost").pathname
    .replace(/^\/api\/?/, "")
    .replace(/\/$/, "");
  const load = loaders[pathname];
  if (!load) return response.status(404).json({ ok: false, error: "API route not found" });
  try {
    const mod = await load();
    return mod.default(request, response);
  } catch (error) {
    console.error("API dispatcher error:", error);
    return response.status(500).json({ ok: false, error: "Internal server error" });
  }
}
