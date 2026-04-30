import { getPopularTV, getTopRatedTV, getAiringTodayTV, getTVDetails } from "./tv.service.js";

export async function getPopularTVAPI(req, res) {
  try {
    const data = await getPopularTV();
    res.json(data.results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching popular TV shows" });
  }
}

export async function getTopRatedTVAPI(req, res) {
  try {
    const data = await getTopRatedTV();
    res.json(data.results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching top rated TV shows" });
  }
}

export async function getAiringTodayAPI(req, res) {
  try {
    const data = await getAiringTodayTV();
    res.json(data.results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching airing today shows" });
  }
}

export async function getTVDetailAPI(req, res) {
  try {
    const { id } = req.params;
    const data = await getTVDetails(id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching TV details" });
  }
}
