import api from "../../services/api";
import { normalizeMedia } from "../media/utils/normalizeMedia";

// Build the discover query string from filter state.
const buildParams = ({ genres = [], year = "", sort = "popularity", page = 1 }) => {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("sort", sort);
  if (genres.length) params.set("genres", genres.join(","));
  if (year) params.set("year", year);
  return params.toString();
};

// Shared discover call. mediaType decides the endpoint + normalized media_type.
const discover = async (mediaType, filters) => {
  const base = mediaType === "tv" ? "/tv/discover" : "/movies/discover";
  const res = await api.get(`${base}?${buildParams(filters)}`);

  const items = (res.data.results || [])
    .map((raw) => normalizeMedia({ ...raw, media_type: mediaType }))
    .filter((item) => item.poster && item.title);

  return {
    items,
    page: res.data.page || 1,
    totalPages: res.data.total_pages || 1,
  };
};

export const discoverMovies = (filters) => discover("movie", filters);
export const discoverTV = (filters) => discover("tv", filters);
