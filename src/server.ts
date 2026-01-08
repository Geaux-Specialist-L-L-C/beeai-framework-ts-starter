import http from "node:http";
import { randomUUID } from "node:crypto";

const port = Number(process.env.PORT ?? 8080);

const server = http.createServer(async (req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "content-type": "text/plain" });
    res.end("ok");
    return;
  }

  // Minimal JSON handler for POST /vark/run
  if (req.method === "POST" && req.url === "/vark/run") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        // TODO: call BeeAI workflow runner here
        const out = {
          sessionId: parsed.sessionId ?? randomUUID(),
          memory: parsed.memory ?? {},
          output: { ok: true },
        };
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(out));
      } catch (e: any) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: e?.message ?? "bad request" }));
      }
    });
    return;
  }

  res.writeHead(404, { "content-type": "text/plain" });
  res.end("not found");
});

server.listen(port, () => console.log(`listening on :${port}`));
