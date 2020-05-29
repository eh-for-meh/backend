import express from "express";
import { config } from "dotenv";

config();

import * as HealthController from "./controllers/health";

const PORT = process.env.PORT || "8080";

const app = express();

app.get("/health-check", HealthController.healthCheck);

app.listen(PORT);
