import { searchMulti } from "./search.service.js";

export async function searchMultiAPI(req, res) {
  try {
    const query = req.query.q;
    const page = Number(req.query.page) || 1;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const data = await searchMulti(query, page);

    res.json({
      results: data.results,
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
    });
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
}
