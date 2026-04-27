export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: "vercel-v2box-config-api",
    timestamp: new Date().toISOString()
  });
}
