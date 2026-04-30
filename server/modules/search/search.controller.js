import { searchMulti } from "./search.service.js";

export async function searchMultiAPI(req, res) {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const data = await searchMulti(query);
    res.json(data.results);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
}
