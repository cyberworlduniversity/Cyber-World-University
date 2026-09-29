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
  if (request.method !== "GET") {
    return json(response, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const token = getSessionToken(request);
    if (!token) return json(response, 401, { ok: false, error: "Not authenticated" });

    const db = await getDatabase();
    const session = await db.collection("sessions").findOne({ token });
    if (!session) return json(response, 401, { ok: false, error: "Session expired" });

    const user = await db.collection("users").findOne({ _id: session.userId });
    if (!user) return json(response, 401, { ok: false, error: "User not found" });

    return json(response, 200, {
      ok: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Session lookup error:", error);
    return json(response, 500, { ok: false, error: "Server configuration or database error" });
  }
}
