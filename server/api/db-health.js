import { getDatabase } from "./_lib/db.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    return response.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });
    return response.status(200).json({
      ok: true,
      service: "Cyber World University",
      database: "connected",
      environment: process.env.VERCEL_ENV || "development",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    return response.status(503).json({
      ok: false,
      service: "Cyber World University",
      database: "unavailable",
      error: "Database connection failed"
    });
  }
}
