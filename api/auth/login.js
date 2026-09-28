import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { getDatabase } from "../_lib/db.js";

const scryptAsync = promisify(scrypt);

async function verifyPassword(password, stored) {
  const [salt, expected] = String(stored).split(":");
  if (!salt || !expected) return false;
  const derived = await scryptAsync(password, salt, 64);
  return Buffer.from(derived).toString("hex") === expected;
}

function json(response, status, body) {
  response.status(status).json(body);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return json(response, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const { email, password } = request.body || {};
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || typeof password !== "string") {
      return json(response, 400, { ok: false, error: "Email and password are required" });
    }

    const db = await getDatabase();
    const user = await db.collection("users").findOne({ email: normalizedEmail });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return json(response, 401, { ok: false, error: "Invalid email or password" });
    }

    const token = randomBytes(32).toString("hex");
    await db.collection("sessions").insertOne({
      token,
      userId: user._id,
      createdAt: new Date()
    });

    response.setHeader(
      "Set-Cookie",
      `cwu_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`
    );

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
    console.error("Login error:", error);
    return json(response, 500, { ok: false, error: "Server configuration or database error" });
  }
}
