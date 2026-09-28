import { getDatabase } from "../_lib/db.js";

function json(response, status, body) {
  response.status(status).json(body);
}

function getSessionToken(request) {
  const cookie = request.headers.cookie || "";
  const match = cookie.match(/(?:^|;\\s*)cwu_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return json(response, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const token = getSessionToken(request);
    if (token) {
      const db = await getDatabase();
      await db.collection("sessions").deleteOne({ token });
    }

    response.setHeader(
      "Set-Cookie",
      "cwu_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0"
    );

    return json(response, 200, { ok: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return json(response, 500, { ok: false, error: "Server configuration or database error" });
  }
}
