import tmdbClient from "../../config/tmdbClient.js";

export async function searchMulti(query) {
  const res = await tmdbClient.get("/search/multi", {
    params: { query },
  });
  return res.data;
}