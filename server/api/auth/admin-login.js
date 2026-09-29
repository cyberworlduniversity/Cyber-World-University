import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { getDatabase } from "../_lib/db.js";

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, 64);
  return salt + ":" + Buffer.from(derived).toString("hex");
}

async function verifyPassword(password, stored) {
  const [salt, expected] = String(stored || "").split(":");
  if (!salt || !expected) return false;
  const derived = await scryptAsync(password, salt, 64);
  return Buffer.from(derived).toString("hex") === expected;
}

function json(res, status, body) { res.status(status).json(body); }

export default async function handler(request, response) {
  if (request.method !== "POST") return json(response, 405, { ok:false, error:"Method not allowed" });

  try {
    const { username, password } = request.body || {};
    const suppliedUsername = typeof username === "string" ? username.trim() : "";
    if (!suppliedUsername || typeof password !== "string") {
      return json(response, 400, { ok:false, error:"Admin username and password are required" });
    }

    const configuredUsername = String(process.env.CWU_ADMIN_USERNAME || "").trim();
    const configuredPassword = String(process.env.CWU_ADMIN_PASSWORD || "");
    if (!configuredUsername || !configuredPassword) {
      return json(response, 503, { ok:false, error:"Admin credentials are not configured on the server" });
    }

    if (suppliedUsername !== configuredUsername || password !== configuredPassword) {
      return json(response, 401, { ok:false, error:"Invalid admin username or password" });
    }

    const db = await getDatabase();
    const users = db.collection("users");
    let user = await users.findOne({ username: configuredUsername, role:"admin" });

    if (!user) {
      const passwordHash = await hashPassword(configuredPassword);
      const result = await users.insertOne({
        username: configuredUsername,
        name: "CWU Administrator",
        email: (process.env.CWU_ADMIN_EMAIL || (configuredUsername + "@cwu.local")).toLowerCase(),
        passwordHash,
        role: "admin",
        createdAt: new Date()
      });
      user = await users.findOne({ _id: result.insertedId });
    } else if (!(await verifyPassword(configuredPassword, user.passwordHash))) {
      await users.updateOne({ _id:user._id }, { $set:{ passwordHash:await hashPassword(configuredPassword), role:"admin" } });
      user = await users.findOne({ _id:user._id });
    }

    const token = randomBytes(32).toString("hex");
    await db.collection("sessions").insertOne({ token, userId:user._id, createdAt:new Date() });
    response.setHeader("Set-Cookie", `cwu_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`);

    return json(response, 200, {
      ok:true,
      user:{ id:user._id.toString(), name:user.name, username:user.username, email:user.email, role:"admin" }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return json(response, 500, { ok:false, error:"Server configuration or database error" });
  }
}
