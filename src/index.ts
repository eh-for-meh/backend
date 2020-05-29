import express from "express";
import { config } from "dotenv";

config();

import * as HealthController from "./controllers/health";
import * as DealsController from "./controllers/deals";

const PORT = process.env.PORT || "8080";

const app = express();

app.get("/health-check", HealthController.healthCheck);
app.get("/deals/current", DealsController.getCurrent);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
