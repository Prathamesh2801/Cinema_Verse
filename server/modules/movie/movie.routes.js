import express from "express";
import {
  getPopularMoviesAPI,
  getTopRatedMoviesAPI,
  getLatestMoviesAPI,
  getMovieDetailAPI
} from "./movie.controller.js";

const router = express.Router();

router.get("/popular", getPopularMoviesAPI);
router.get("/top-rated", getTopRatedMoviesAPI);
router.get("/latest", getLatestMoviesAPI);
router.get("/:id", getMovieDetailAPI);

export default router;