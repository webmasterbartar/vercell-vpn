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

function buildTlsUri({ host, port, uuid, sni, remark }) {
  const params = new URLSearchParams({
    encryption: "none",
    security: "tls",
    type: "tcp",
    sni: sni || host
  });
  return `vless://${uuid}@${host}:${port}?${params.toString()}#${encodeURIComponent(
    remark || "my-vpn"
  )}`;
}

function buildRealityUri({ host, port, uuid, sni, fp, pbk, sid, spx, remark }) {
  const params = new URLSearchParams({
    encryption: "none",
    security: "reality",
    type: "tcp",
    sni: sni || host,
    fp: fp || "chrome",
    pbk,
    sid: sid || "",
    spx: spx || "/"
  });
  return `vless://${uuid}@${host}:${port}?${params.toString()}#${encodeURIComponent(
    remark || "my-vpn"
  )}`;
}

export default function handler(req, res) {
  if (!verifyToken(req, res)) return;

  const host = process.env.VPN_HOST || "";
  const port = Number(process.env.VPN_PORT || 443);
  const uuid = process.env.VPN_UUID || "";
  const sni = process.env.VPN_SNI || host;
  const remark = process.env.VPN_REMARK || "my-vpn";
  const mode = (process.env.VPN_MODE || "tls").toLowerCase();

  if (!host || !uuid) {
    res.status(500).send("Missing env vars: VPN_HOST and VPN_UUID are required.");
    return;
  }

  if (mode === "reality") {
    const pbk = process.env.VPN_PBK || "";
    if (!pbk) {
      res.status(500).send("VPN_MODE=reality requires VPN_PBK.");
      return;
    }
    const uri = buildRealityUri({
      host,
      port,
      uuid,
      sni,
      fp: process.env.VPN_FP || "chrome",
      pbk,
      sid: process.env.VPN_SID || "",
      spx: process.env.VPN_SPX || "/",
      remark
    });
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(uri);
    return;
  }

  const uri = buildTlsUri({ host, port, uuid, sni, remark });
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(uri);
}
