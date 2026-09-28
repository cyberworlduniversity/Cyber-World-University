import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { getDatabase } from "../_lib/db.js";

const scryptAsync = promisify(scrypt);

function json(response, status, body) {
  response.status(status).json(body);
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(password, salt, 64);
  return `${salt}:${Buffer.from(derivedKey).toString("hex")}`;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return json(response, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const { name, email, password } = request.body || {};

    if (typeof name !== "string" || name.trim().length < 2) {
      return json(response, 400, { ok: false, error: "A valid name is required" });
    }

    if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return json(response, 400, { ok: false, error: "A valid email is required" });
    }

    if (typeof password !== "string" || password.length < 8) {
      return json(response, 400, { ok: false, error: "Password must contain at least 8 characters" });
    }

    const db = await getDatabase();
    const users = db.collection("users");
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await users.findOne({ email: normalizedEmail });
    if (existing) {
      return json(response, 409, { ok: false, error: "An account with this email already exists" });
    }

    const passwordHash = await hashPassword(password);

    const result = await users.insertOne({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "student",
      createdAt: new Date()
    });

    return json(response, 201, {
      ok: true,
      userId: result.insertedId.toString(),
      message: "Registration successful"
    });
  } catch (error) {
    console.error("Registration error:", error);
    return json(response, 500, { ok: false, error: "Server configuration or database error" });
  }
}
