import http from "node:http";
import { createLogger } from "@kenora/observability";
import { IngestionProcessor } from "./processors/ingestion.processor.js";
import { env } from "@kenora/config";

const logger = createLogger({ serviceName: "kenora-workers" });

async function startWorkerDaemon() {
  logger.info("⚙️ Initializing Kenora Background Worker Daemon");

  const ingestionProcessor = new IngestionProcessor();

  // Run periodic poll cycle simulation for phase 0 sanity
  setInterval(async () => {
    try {
      await ingestionProcessor.processSourcePolling(
        "src-1",
        "generic",
        "https://docs.kenora.ai/advisories",
      );
    } catch (err) {
      logger.error(err, "Error in worker background cycle");
    }
  }, 60000);

  // Worker Health Check HTTP Server
  const workerPort = env.WORKER_PORT || 4001;
  const server = http.createServer((req, res) => {
    if (req.url === "/health" || req.url === "/healthz") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "ok",
          service: "kenora-workers",
          timestamp: new Date().toISOString(),
        }),
      );
      return;
    }
    res.writeHead(404);
    res.end();
  });

  server.listen(workerPort, () => {
    logger.info(`✅ Kenora Worker Health Server running on port ${workerPort}`);
  });

  process.on("SIGTERM", () => {
    logger.info("SIGTERM received. Shutting down worker gracefully...");
    server.close(() => process.exit(0));
  });
}

startWorkerDaemon().catch((err) => {
  logger.fatal(err, "Worker startup failed");
  process.exit(1);
});
