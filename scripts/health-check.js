import http from "http";

const endpoints = [
  { name: "Web Client App", url: "http://localhost:3000/api/health" },
  { name: "NestJS API Platform", url: "http://localhost:4000/api/v1/health" },
  { name: "Worker Daemon Probe", url: "http://localhost:4001/health" },
];

async function checkEndpoint(endpoint) {
  return new Promise((resolve) => {
    http
      .get(endpoint.url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({
            name: endpoint.name,
            url: endpoint.url,
            statusCode: res.statusCode,
            ok: res.statusCode >= 200 && res.statusCode < 300,
            data,
          });
        });
      })
      .on("error", (err) => {
        resolve({
          name: endpoint.name,
          url: endpoint.url,
          statusCode: 0,
          ok: false,
          error: err.message,
        });
      });
  });
}

async function runHealthCheck() {
  console.log("🔍 Executing Kenora Monorepo Health Checks...\n");
  const results = await Promise.all(endpoints.map(checkEndpoint));

  results.forEach((r) => {
    if (r.ok) {
      console.log(`✅ ${r.name} (${r.url}) -> HTTP ${r.statusCode}`);
    } else {
      console.log(
        `❌ ${r.name} (${r.url}) -> ${r.error || "HTTP " + r.statusCode}`,
      );
    }
  });
}

runHealthCheck();
