import {
  getPopularMovies,
  getMovieDetails,
  discoverMovies,
} from "./movie.service.js";

export async function getPopularMoviesAPI(req, res) {
  try {
    const data = await getPopularMovies();
    res.json(data.results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching popular movies" });
  }
}

export async function getTopRatedMoviesAPI(req, res) {
  try {
    const data = await discoverMovies(
      {
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
    res.status(500).json({ message: "Error fetching top rated movies" });
  }
}

export async function getLatestMoviesAPI(req, res) {
  try {
    const data = await discoverMovies(
      {
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
    res.status(500).json({ message: "Error fetching latest movies" });
  }
}

export async function getMovieDetailAPI(req, res) {
  try {
    const { id } = req.params;
    const data = await getMovieDetails(id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching movie details" });
  }
}
