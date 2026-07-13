import api from "../../services/api";

// Paged multi-search (movies + tv + people). Returns the raw TMDB items so the
// UI can render people (profile_path/name) alongside media (poster_path/title).
export const searchMedia = async (query, page = 1) => {
  const res = await api.get(
    `/search?q=${encodeURIComponent(query)}&page=${page}`,
  );
  return {
    results: res.data.results || [],
    page: res.data.page || 1,
    totalPages: res.data.total_pages || 1,
  };
};

// Backward-compatible helper (flat array) for any lightweight caller.
export const searchMulti = async (query) => {
  const { results } = await searchMedia(query);
  return results;
};
