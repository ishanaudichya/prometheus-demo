const express = require("express");
const promClient = require("prom-client");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable collection of default metrics like CPU and memory usage
promClient.collectDefaultMetrics();

// Define a counter metric
const httpRequestCounter = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "status_code"],
});

app.get("/", (req, res) => {
  // Increment the counter for each incoming request
  httpRequestCounter.inc({ method: req.method, status_code: res.statusCode });

  res.send("Hello World");
});

// Expose Prometheus metrics endpoint
app.get("/metrics", (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(promClient.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
