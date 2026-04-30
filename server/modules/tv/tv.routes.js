import express from "express";
import {
  getPopularTVAPI,
  getTopRatedTVAPI,
  getAiringTodayAPI,
  getTVDetailAPI,
} from "./tv.controller.js";

const router = express.Router();

router.get("/popular", getPopularTVAPI);
router.get("/top-rated", getTopRatedTVAPI);
router.get("/airing-today", getAiringTodayAPI);
router.get("/:id", getTVDetailAPI);

export default router;
