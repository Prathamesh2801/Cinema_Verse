import {
  getPopularMovies,
  getMovieDetails,
  discoverMovies,
} from "./movie.service.js";

// ======================================
// 🔥 POPULAR MOVIES
// ======================================

export async function getPopularMoviesAPI(req, res) {
  try {
    const page = Number(req.query.page) || 1;

    const data = await getPopularMovies(page);

    res.json(data.results);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching popular movies",
    });
  }
}

// ======================================
// ⭐ TOP RATED MOVIES
// ======================================

export async function getTopRatedMoviesAPI(req, res) {
  try {
    const page = Number(req.query.page) || 1;

    const data = await discoverMovies(
      {
        page,
        sort_by: "vote_average.desc",
        "vote_count.gte": 1000,
      },
      {
        minVoteCount: 1000,
        minVoteAverage: 7.2,
        requirePoster: true,
      },
    );

    res.json(data.results);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching top rated movies",
    });
  }
}

// ======================================
// 🚀 LATEST MOVIES
// ======================================

export async function getLatestMoviesAPI(req, res) {
  try {
    const page = Number(req.query.page) || 1;

    const data = await discoverMovies(
      {
        page,
        sort_by: "release_date.desc",
        "vote_count.gte": 300,
      },
      {
        minVoteCount: 300,
        minVoteAverage: 6.3,
        requirePoster: true,
      },
    );

    res.json(data.results);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching latest movies",
    });
  }
}

// ======================================
// 🧭 DISCOVER / BROWSE MOVIES (filterable)
// ======================================

export async function discoverMoviesAPI(req, res) {
  try {
    const { genres, year, sort } = req.query;
    const page = Number(req.query.page) || 1;

    const params = {
      page,
      include_adult: false,
    };

    if (genres) params.with_genres = genres; // comma-separated TMDB genre ids
    if (year) params.primary_release_year = year;

    switch (sort) {
      case "rating":
        params.sort_by = "vote_average.desc";
        params["vote_count.gte"] = 300;
        break;
      case "newest":
        params.sort_by = "primary_release_date.desc";
        params["vote_count.gte"] = 100;
        break;
      case "popularity":
      default:
        params.sort_by = "popularity.desc";
        break;
    }

    const data = await discoverMovies(params, {
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
      message: "Error discovering movies",
    });
  }
}

// ======================================
// 🎬 MOVIE DETAILS
// ======================================

export async function getMovieDetailAPI(req, res) {
  try {
    const { id } = req.params;

    const data = await getMovieDetails(id);

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching movie details",
    });
  }
}
