import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import config from "./config";
import router from "./routes/index.route";

import {
    notFoundError,
    genericErrorHandler,
} from "./middlewares/errorHandler.middleware";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: config.cors.origin,
  })
);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));
app.use(cookieParser());

/**Route handler */
app.use(router);
app.use(notFoundError);
app.use(genericErrorHandler);

export default app;
