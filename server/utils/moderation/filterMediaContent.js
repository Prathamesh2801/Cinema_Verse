// server/utils/moderation/filterMediaContent.js

/**
 * Base quality moderation filter
 * Used for movies + TV series content
 */

const DEFAULT_FILTER_CONFIG = {
  minVoteCount: 300,
  minVoteAverage: 6.5,
  allowAdult: false,
  requirePoster: true,
  requireBackdrop: false,
};

export const filterMediaContent = (mediaList = [], customConfig = {}) => {
  const config = {
    ...DEFAULT_FILTER_CONFIG,
    ...customConfig,
  };

  return mediaList.filter((media) => {
    // Adult content filtering
    if (!config.allowAdult && media.adult) {
      return false;
    }

    // Minimum vote count
    if ((media.vote_count || 0) < config.minVoteCount) {
      return false;
    }

    // Minimum average rating
    if ((media.vote_average || 0) < config.minVoteAverage) {
      return false;
    }

    // Poster required
    if (config.requirePoster && !media.poster_path) {
      return false;
    }

    // Backdrop required
    if (config.requireBackdrop && !media.backdrop_path) {
      return false;
    }
    // Moderate suspicious low-quality anime/ecchi-style content
    const isAnime = media.genre_ids?.includes(16);
    const isJapanese = media.original_language === "ja";

    if (isAnime && isJapanese && (media.vote_count || 0) < 500) {
      return false;
    }

    return true;
  });
};
