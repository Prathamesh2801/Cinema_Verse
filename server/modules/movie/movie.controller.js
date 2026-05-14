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
