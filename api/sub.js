function toNumber(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
}

function requiredParam(query, key) {
  const value = query[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function verifyToken(req, res) {
  const expectedToken = process.env.API_TOKEN;
  if (!expectedToken) return true;
  const tokenFromQuery = requiredParam(req.query, "token");
  const tokenFromHeader =
    typeof req.headers["x-api-key"] === "string" ? req.headers["x-api-key"].trim() : "";
  if (tokenFromQuery === expectedToken || tokenFromHeader === expectedToken) return true;
  res.status(401).send("Unauthorized");
  return false;
}

function encodeVlessUri({ host, port, uuid, sni, fp, pbk, sid, spiderX, remark }) {
  const params = new URLSearchParams({
    encryption: "none",
    security: "reality",
    type: "tcp",
    sni: sni || host,
    fp: fp || "chrome",
    pbk,
    sid: sid || "",
    spx: spiderX || "/"
  });

  return `vless://${uuid}@${host}:${port}?${params.toString()}#${encodeURIComponent(
    remark || "vercel-v2box"
  )}`;
}

export default function handler(req, res) {
  if (!verifyToken(req, res)) return;

  const host = requiredParam(req.query, "host");
  const uuid = requiredParam(req.query, "uuid");
  const pbk = requiredParam(req.query, "pbk");
  const port = toNumber(req.query.port, 443);
  const sni = requiredParam(req.query, "sni");
  const fp = requiredParam(req.query, "fp");
  const sid = requiredParam(req.query, "sid");
  const spiderX = requiredParam(req.query, "spx");
  const remark = requiredParam(req.query, "remark");

  if (!host || !uuid || !pbk) {
    res.status(400).send("Missing required query params: host, uuid, pbk");
    return;
  }

  const vlessUri = encodeVlessUri({
    host,
    port,
    uuid,
    sni,
    fp,
    pbk,
    sid,
    spiderX,
    remark
  });

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(vlessUri);
}
