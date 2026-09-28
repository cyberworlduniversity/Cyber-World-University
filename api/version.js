const version = "1.3.0";

export default function handler(request, response) {
  response.status(200).json({
    ok: true,
    service: "Cyber World University",
    version,
    release: "Student profile foundation",
    runtime: "nodejs"
  });
}
