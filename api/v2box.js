function toNumber(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
}

function requiredParam(query, key) {
  const value = query[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function unauthorized(res) {
  res.status(401).json({
    error: "Unauthorized. Provide valid token via query `token` or header `x-api-key`."
  });
}

function verifyToken(req, res) {
  const expectedToken = process.env.API_TOKEN;
  if (!expectedToken) return true;
  const tokenFromQuery = requiredParam(req.query, "token");
  const tokenFromHeader =
    typeof req.headers["x-api-key"] === "string" ? req.headers["x-api-key"].trim() : "";
  if (tokenFromQuery === expectedToken || tokenFromHeader === expectedToken) return true;
  unauthorized(res);
  return false;
}

function encodeVlessUri({
  host,
  port,
  uuid,
  sni,
  fp,
  pbk,
  sid,
  spiderX,
  remark
}) {
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

function buildV2BoxConfig({
  host,
  port,
  uuid,
  sni,
  fp,
  pbk,
  sid,
  spiderX,
  remark
}) {
  return {
    log: {
      level: "warn"
    },
    inbounds: [
      {
        type: "tun",
        tag: "tun-in",
        interface_name: "tun0",
        inet4_address: "172.19.0.1/30",
        auto_route: true,
        strict_route: true
      }
    ],
    outbounds: [
      {
        type: "vless",
        tag: "proxy",
        server: host,
        server_port: port,
        uuid,
        flow: "",
        packet_encoding: "xudp",
        tls: {
          enabled: true,
          server_name: sni || host,
          insecure: false,
          utls: {
            enabled: true,
            fingerprint: fp || "chrome"
          },
          reality: {
            enabled: true,
            public_key: pbk,
            short_id: sid || ""
          }
        },
        transport: {
          type: "tcp"
        }
      },
      {
        type: "direct",
        tag: "direct"
      },
      {
        type: "block",
        tag: "block"
      }
    ],
    route: {
      auto_detect_interface: true,
      rules: [
        {
          protocol: "dns",
          outbound: "direct"
        }
      ],
      final: "proxy"
    },
    dns: {
      servers: [
        {
          tag: "cloudflare",
          address: "tls://1.1.1.1"
        },
        {
          tag: "google",
          address: "tls://8.8.8.8"
        }
      ],
      rules: [
        {
          outbound: "any",
          server: "cloudflare"
        }
      ]
    },
    metadata: {
      name: remark || "vercel-v2box",
      spider_x: spiderX || "/"
    }
  };
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
    res.status(400).json({
      error: "Missing required query params: host, uuid, pbk"
    });
    return;
  }

  const config = buildV2BoxConfig({
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

  const format = requiredParam(req.query, "format");
  if (format === "uri") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(vlessUri);
    return;
  }

  if (format === "json") {
    res.status(200).json(config);
    return;
  }

  res.status(200).json({ vlessUri, config });
}
