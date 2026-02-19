import mongoose from "mongoose";
import app from "./app.js";
import "./jobs/recall.job.js";
import { ENV } from "./config/env.js";
import { log } from "./config/logger.js";
import "./jobs/decay.job.js";


mongoose
  .connect(ENV.MONGO_URI)
  .then(() => {
    app.listen(ENV.PORT, () =>
      log("Backend running on port", ENV.PORT)
    );
  })
  .catch(err => log("DB error", err));
