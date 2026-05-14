import {
  getPopularMovies,
  getTopRatedMovies,
  getLatestMovies,
} from "../../movies/movie.api";

import { getPopularTV, getTopRatedTV, getLatestTV } from "../../tv/tv.api";

// =====================================
// 🎯 CONTENT FILTER HELPERS
// =====================================

const ANIMATION_GENRE = 16;

const isAnimated = (item) => item.genre_ids?.includes(ANIMATION_GENRE);

const isAnime = (item) => isAnimated(item) && item.original_language === "ja";

const excludeAnime = (items) => items.filter((item) => !isAnime(item));

// =====================================
// 🔥 TRENDING WORLDWIDE
// =====================================

export const fetchTrendingMedia = async () => {
  const [movies, tv] = await Promise.all([getPopularMovies(), getPopularTV()]);

  return [...movies, ...tv]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 40);
};

// =====================================
// ⭐ CRITICALLY ACCLAIMED
// =====================================

export const fetchTopRatedMedia = async () => {
  const [movies, tv] = await Promise.all([
    getTopRatedMovies(),
    getTopRatedTV(),
  ]);

  return excludeAnime([...movies, ...tv])
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 40);
};

// =====================================
// 🚀 NEW & DISCOVER
// =====================================

export const fetchDiscoverMedia = async () => {
  const [movies, tv] = await Promise.all([getLatestMovies(), getLatestTV()]);

  return [...movies, ...tv]
    .sort(
      (a, b) =>
        new Date(b.release_date || b.first_air_date) -
        new Date(a.release_date || a.first_air_date),
    )
    .slice(0, 40);
};

// =====================================
// 🎌 ANIME SPOTLIGHT
// =====================================

export const fetchAnimeMedia = async () => {
  const tv = await getPopularTV();

  return tv
    .filter(isAnime)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 40);
};

// =====================================
// 🎥 DARK & INTENSE
// =====================================

export const fetchDarkIntenseMedia = async () => {
  const [movies, tv] = await Promise.all([
    getTopRatedMovies(),
    getTopRatedTV(),
  ]);

  return excludeAnime([...movies, ...tv])
    .filter((item) =>
      item.genre_ids?.some((id) =>
        [
          53, // Thriller
          80, // Crime
          9648, // Mystery
        ].includes(id),
      ),
    )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 30);
};

// =====================================
// 🚀 MIND-BENDING SCI-FI
// =====================================

export const fetchSciFiMedia = async () => {
  const [movies, tv] = await Promise.all([getPopularMovies(), getPopularTV()]);

  return excludeAnime([...movies, ...tv])
    .filter((item) =>
      item.genre_ids?.some((id) =>
        [
          878, // Sci-Fi
          14, // Fantasy
          12, // Adventure
        ].includes(id),
      ),
    )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 40);
};

// =====================================
// 🌎 ANIMATED WORLDS
// =====================================

export const fetchAnimatedMedia = async () => {
  const [movies, tv] = await Promise.all([getPopularMovies(), getPopularTV()]);

  return [...movies, ...tv]
    .filter(isAnimated)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 40);
};

// =====================================
// 💎 HIDDEN GEMS
// =====================================

export const fetchHiddenGems = async () => {
  const [movies, tv] = await Promise.all([
    getTopRatedMovies(),
    getTopRatedTV(),
  ]);

  return excludeAnime([...movies, ...tv])
    .filter((item) => item.vote_average >= 7.5 && item.popularity < 150)
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 30);
};

// =====================================
// 🌟 FEATURED HERO MEDIA
// =====================================

export const fetchFeaturedHeroMedia = async () => {
  const trending = await fetchTrendingMedia();

  const filtered = trending.filter(
    (item) => item.backdrop_path && item.vote_average >= 7,
  );

  const randomIndex = Math.floor(Math.random() * filtered.length);

  return filtered[randomIndex];
};
