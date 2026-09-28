const version = "1.1.0";

export default function handler(request, response) {
  response.status(200).json({
    ok: true,
    service: "Cyber World University",
    version,
    release: "Production foundation",
    runtime: "nodejs"
  });
}
