// Compute library stats from already-hydrated *watched* items.
// Each item is a TMDB detail object augmented with { media_type, rating, watchedAt }.

function itemMinutes(item) {
  if (item.media_type === "tv") {
    const per = item.episode_run_time?.[0] || 0;
    const eps = item.number_of_episodes || 0;
    return per * eps;
  }
  return item.runtime || 0;
}

export function computeStats(watchedItems = []) {
  const totalWatched = watchedItems.length;

  const totalMinutes = watchedItems.reduce((sum, i) => sum + itemMinutes(i), 0);
  const totalHours = Math.round(totalMinutes / 60);

  const currentYear = new Date().getFullYear();
  const thisYear = watchedItems.filter(
    (i) => i.watchedAt && new Date(i.watchedAt).getFullYear() === currentYear,
  ).length;

  // Top genres across watched titles.
  const genreCounts = {};
  watchedItems.forEach((i) => {
    (i.genres || []).forEach((g) => {
      if (!g?.name) return;
      genreCounts[g.name] = (genreCounts[g.name] || 0) + 1;
    });
  });
  const topGenres = Object.entries(genreCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Rating distribution (1..5) + average over rated titles.
  const ratingDist = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: watchedItems.filter((i) => i.userRating === star).length,
  }));
  const rated = watchedItems.filter((i) => i.userRating > 0);
  const avgRating = rated.length
    ? rated.reduce((s, i) => s + i.userRating, 0) / rated.length
    : 0;

  const movies = watchedItems.filter((i) => i.media_type === "movie").length;
  const shows = watchedItems.filter((i) => i.media_type === "tv").length;

  return {
    totalWatched,
    totalHours,
    thisYear,
    topGenres,
    ratingDist,
    avgRating,
    movies,
    shows,
  };
}
