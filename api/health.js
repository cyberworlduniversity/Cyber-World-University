export default function handler(request, response) {
  response.status(200).json({
    ok: true,
    service: "Cyber World University",
    runtime: "nodejs",
    environment: process.env.VERCEL_ENV || "development",
    timestamp: new Date().toISOString()
  });
}
