export default function handler(req, res) {
  res.status(200).json({
    required: {
      host: "Domain or IP of your VLESS/Reality server",
      uuid: "Client UUID from your panel",
      pbk: "Reality public key from inbound settings"
    },
    optional: {
      port: "Server port (default: 443)",
      sni: "SNI value (default: host)",
      fp: "uTLS fingerprint (default: chrome)",
      sid: "Reality short id",
      spx: "Reality spider x path (default: /)",
      remark: "Profile name for client"
    },
    example:
      "/api/v2box?host=vpn.example.com&uuid=11111111-2222-3333-4444-555555555555&pbk=YOUR_PUBLIC_KEY&sid=abcd&sni=vpn.example.com&fp=chrome&spx=%2F&remark=my-vpn"
  });
}
