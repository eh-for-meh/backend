import express from "express";
import { config } from "dotenv";

config();

import * as HealthController from "./routers/health";
import * as DealsController from "./routers/deals";

const PORT = process.env.PORT || "8080";

const app = express();

app.get("/health-check", HealthController.healthCheck);
app.get("/deals/current", DealsController.getCurrent);
app.get("/deals/:id", DealsController.get);
app.put("/deals/current", DealsController.updateCurrentDealInDatabase);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
