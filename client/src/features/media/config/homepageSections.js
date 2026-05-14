import {
  fetchTrendingMedia,
  fetchTopRatedMedia,
  fetchDiscoverMedia,
  fetchDarkIntenseMedia,
  fetchSciFiMedia,
  fetchAnimatedMedia,
  fetchHiddenGems,
} from "../api/media.api";

export const homepageSections = [
  {
    id: "trending",
    title: "Trending Worldwide",
    fetcher: fetchTrendingMedia,
  },

  {
    id: "topRated",
    title: "Critically Acclaimed",
    fetcher: fetchTopRatedMedia,
  },

  {
    id: "discover",
    title: "New & Discover",
    fetcher: fetchDiscoverMedia,
  },

  {
    id: "dark",
    title: "Dark & Intense",
    fetcher: fetchDarkIntenseMedia,
  },

  {
    id: "scifi",
    title: "Mind-Bending Sci-Fi",
    fetcher: fetchSciFiMedia,
  },

  {
    id: "animated",
    title: "Animated Worlds",
    fetcher: fetchAnimatedMedia,
  },

  {
    id: "hidden",
    title: "Hidden Gems",
    fetcher: fetchHiddenGems,
  },
];
