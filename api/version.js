const version = "1.2.1";

export default function handler(request, response) {
  response.status(200).json({
    ok: true,
    service: "Cyber World University",
    version,
    release: "Production authentication foundation",
    runtime: "nodejs"
  });
}
