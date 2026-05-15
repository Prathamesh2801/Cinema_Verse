import {
  getPopularMovies,
  getTopRatedMovies,
  getLatestMovies,
} from "../../movies/movie.api";

import { getPopularTV, getTopRatedTV, getLatestTV } from "../../tv/tv.api";

// =====================================
// 🎯 GENRE CONSTANTS
// =====================================

const GENRES = {
  ANIMATION: 16,

  SCI_FI: 878,
  SCI_FI_FANTASY: 10765,

  FANTASY: 14,
  ADVENTURE: 12,

  THRILLER: 53,
  CRIME: 80,
  MYSTERY: 9648,
};

// =====================================
// 🎯 UNIVERSAL GENRE HELPER
// =====================================

const hasGenre = (item, genreId) => {
  // TMDB genre_ids support
  if (item.genre_ids?.includes(genreId)) {
    return true;
  }

  // TMDB detailed genres support
  if (item.genres?.some((genre) => genre.id === genreId)) {
    return true;
  }

  return false;
};

// =====================================
// 🎯 CONTENT HELPERS
// =====================================

const isAnimated = (item) => hasGenre(item, GENRES.ANIMATION);

const isAnime = (item) => isAnimated(item) && item.original_language === "ja";

const excludeAnime = (items) => items.filter((item) => !isAnime(item));

// =====================================
// 🚀 MULTI PAGE FETCH HELPER
// =====================================

const mergePages = async (fetcher, totalPages = 2) => {
  const responses = await Promise.all(
    Array.from({ length: totalPages }, (_, i) => fetcher(i + 1)),
  );

  return responses.flat();
};

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
  const [movies, tv] = await Promise.all([getPopularMovies(), getPopularTV()]);

  return excludeAnime([...movies, ...tv])
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 40);
};

// =====================================
// 🚀 NEW & DISCOVER
// =====================================

export const fetchDiscoverMedia = async () => {
  const [movies, tv] = await Promise.all([getPopularMovies(), getPopularTV()]);

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
  const tv = await mergePages(getPopularTV);

  return tv
    .filter(isAnime)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 40);
};

// =====================================
// 🌎 ANIMATED WORLDS
// =====================================

export const fetchAnimatedMedia = async () => {
  const [movies, tv] = await Promise.all([
    mergePages(getPopularMovies),
    mergePages(getPopularTV),
  ]);

  return [...movies, ...tv]
    .filter(isAnimated)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 40);
};

// =====================================
// 🎥 DARK & INTENSE
// =====================================

export const fetchDarkIntenseMedia = async () => {
  const [movies, tv] = await Promise.all([getPopularMovies(), getPopularTV()]);

  return excludeAnime([...movies, ...tv])
    .filter((item) =>
      [GENRES.THRILLER, GENRES.CRIME, GENRES.MYSTERY].some((genreId) =>
        hasGenre(item, genreId),
      ),
    )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 40);
};

// =====================================
// 🚀 MIND-BENDING SCI-FI
// =====================================

export const fetchSciFiMedia = async () => {
  const [movies, tv] = await Promise.all([
    mergePages(getPopularMovies),
    mergePages(getPopularTV),
  ]);

  return [...movies, ...tv]
    .filter((item) =>
      [
        GENRES.SCI_FI,
        GENRES.SCI_FI_FANTASY,
        GENRES.FANTASY,
        GENRES.ADVENTURE,
      ].some((genreId) => hasGenre(item, genreId)),
    )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 40);
};

// =====================================
// 💎 HIDDEN GEMS
// =====================================

export const fetchHiddenGems = async () => {
  const [movies, tv] = await Promise.all([
    mergePages(getPopularMovies),
    mergePages(getPopularTV),
  ]);

  return excludeAnime([...movies, ...tv])
    .filter((item) => item.vote_average >= 7.5 && item.popularity < 150)
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 40);
};
