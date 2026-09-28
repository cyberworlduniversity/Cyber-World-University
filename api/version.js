const version = "1.5.0";

export default function handler(request, response) {
  response.status(200).json({
    ok: true,
    service: "Cyber World University",
    version,
    release: "Server-side course progress",
    runtime: "nodejs"
  });
}
