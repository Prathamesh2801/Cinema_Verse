import {
  getPopularTV,
  getTopRatedTV,
  getAiringTodayTV,
  discoverTV,
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
// 🧭 DISCOVER / BROWSE TV (filterable)
// ======================================

export async function discoverTVAPI(req, res) {
  try {
    const { genres, year, sort } = req.query;
    const page = Number(req.query.page) || 1;

    const params = {
      page,
      include_adult: false,
    };

    if (genres) params.with_genres = genres; // comma-separated TMDB genre ids
    if (year) params.first_air_date_year = year;

    switch (sort) {
      case "rating":
        params.sort_by = "vote_average.desc";
        params["vote_count.gte"] = 300;
        break;
      case "newest":
        params.sort_by = "first_air_date.desc";
        params["vote_count.gte"] = 100;
        break;
      case "popularity":
      default:
        params.sort_by = "popularity.desc";
        break;
    }

    const data = await discoverTV(params, {
      minVoteCount: 80,
      minVoteAverage: 5.0,
      requirePoster: true,
    });

    res.json({
      results: data.results,
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error discovering TV shows",
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
