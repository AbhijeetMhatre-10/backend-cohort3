import express from "express";
import {
  createUrl,
  deleteUrl,
  getAllUrls,
} from "../controller/url.controller.js";

const urlRouter = express.Router();

/**
 * @POST /api/urls/create
 */
urlRouter.post("/create", createUrl);

/**
 * @GET /api/urls
 */
urlRouter.get("", getAllUrls);

/**
 * @DELETE /api/urls/:id
 */
urlRouter.delete("/:id", deleteUrl);

export default urlRouter;
