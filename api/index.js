export default function handler(req, res) {
  const baseUrl = `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}`;
  res.status(200).json({
    name: "vercel-v2box-config-api",
    ui: `${baseUrl}/`,
    endpoints: {
      health: `${baseUrl}/api/health`,
      params: `${baseUrl}/api/params`,
      generate: `${baseUrl}/api/v2box?host=example.com&uuid=YOUR_UUID&pbk=YOUR_PUBLIC_KEY&sid=abcd&sni=example.com&fp=chrome&spx=%2F&remark=my-profile`,
      subscription: `${baseUrl}/api/sub?host=example.com&uuid=YOUR_UUID&pbk=YOUR_PUBLIC_KEY&sid=abcd&sni=example.com&fp=chrome&spx=%2F&remark=my-profile`,
      quick: `${baseUrl}/api/quick`
    },
    requiredQuery: ["host", "uuid", "pbk"],
    optionalQuery: ["port", "sni", "fp", "sid", "spx", "remark", "token", "format"],
    notes: {
      token: "If API_TOKEN env is set, send token in query or x-api-key header.",
      format: "v2box endpoint supports format=uri or format=json",
      quick: "Returns one ready-to-import URI from server env vars. Default mode is tls."
    }
  });
}
