import express from "express";
import cors from "cors";

// Routes (modular)
import movieRoutes from "./modules/movie/movie.routes.js";
import tvRoutes from "./modules/tv/tv.routes.js";
import searchRoutes from "./modules/search/search.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import reviewRoutes from "./modules/review/review.routes.js";
import bookmarkRoutes from "./modules/bookmark/bookmark.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Routes
app.use("/api/movies", movieRoutes);
app.use("/api/tv", tvRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/bookmark", bookmarkRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API Running 🚀" });
});

export default app;
