import express from "express";
import { searchMultiAPI } from "./search.controller.js";

const router = express.Router();

router.get("/", searchMultiAPI);

export default router;