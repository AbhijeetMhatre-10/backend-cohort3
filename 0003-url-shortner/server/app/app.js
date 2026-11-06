import express from "express";
import urlRouter from "../routes/url.route.js";
import { redirect } from "../controller/url.controller.js";

const app = express();

app.use(express.json());

app.use("/api/urls", urlRouter);

/**
 * @GET /:shortUrl
 */
app.use("/:shortUrl", redirect);

export default app;
