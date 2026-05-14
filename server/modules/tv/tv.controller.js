import {
  getPopularTV,
  getTopRatedTV,
  getAiringTodayTV,
  getTVDetails,
} from "./tv.service.js";

// ======================================
// 📺 POPULAR TV
// ======================================

export async function getPopularTVAPI(req, res) {
  try {
    const page = Number(req.query.page) || 1;

    const data = await getPopularTV(page);

    res.json(data.results);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching popular TV shows",
    });
  }
}

// ======================================
// ⭐ TOP RATED TV
// ======================================

export async function getTopRatedTVAPI(req, res) {
  try {
    const page = Number(req.query.page) || 1;

    const data = await getTopRatedTV(page);

    res.json(data.results);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching top rated TV shows",
    });
  }
}

// ======================================
// 🚀 AIRING TODAY
// ======================================

export async function getAiringTodayAPI(req, res) {
  try {
    const page = Number(req.query.page) || 1;

    const data = await getAiringTodayTV(page);

    res.json(data.results);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching airing today shows",
    });
  }
}

// ======================================
// 📺 TV DETAILS
// ======================================

export async function getTVDetailAPI(req, res) {
  try {
    const { id } = req.params;

    const data = await getTVDetails(id);

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching TV details",
    });
  }
}
