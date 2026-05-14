export const normalizeMedia = (item) => {
  return {
    id: item.id,

    mediaType: item.media_type || (item.title ? "movie" : "tv"),

    title: item.title || item.name || "Untitled",

    overview: item.overview || "",

    poster: item.poster_path,

    backdrop: item.backdrop_path,

    rating: item.vote_average || 0,

    popularity: item.popularity || 0,

    year: (item.release_date || item.first_air_date || "").slice(0, 4),

    genres: item.genre_ids || [],

    raw: item,
  };
};
