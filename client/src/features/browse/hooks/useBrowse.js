import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { discoverMovies, discoverTV } from "../browse.api";
import { DEFAULT_SORT } from "../config/sortOptions";

// Filters live in the URL (?genres=28,878&year=2021&sort=rating) so they're
// shareable and survive refresh/back. Page is internal (ephemeral "Load more").
export function useBrowse(mediaType) {
  const [searchParams, setSearchParams] = useSearchParams();

  const genres = (searchParams.get("genres") || "")
    .split(",")
    .filter(Boolean)
    .map(Number);
  const year = searchParams.get("year") || "";
  const sort = searchParams.get("sort") || DEFAULT_SORT;

  const filterKey = `${mediaType}|${genres.join(",")}|${year}|${sort}`;

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetcher = mediaType === "tv" ? discoverTV : discoverMovies;
  const requestId = useRef(0);

  // Refetch from page 1 whenever the filters (or tab) change.
  useEffect(() => {
    const id = ++requestId.current;
    // Intentional: reset to the loading state before refetching on filter change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    fetcher({ genres, year, sort, page: 1 })
      .then((res) => {
        if (id !== requestId.current) return;
        setItems(res.items);
        setPage(res.page);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        console.error("Browse load error:", err);
        setError(err);
        setItems([]);
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading || page >= totalPages) return;
    const id = requestId.current; // stay tied to the current filter set
    const nextPage = page + 1;
    setLoadingMore(true);

    fetcher({ genres, year, sort, page: nextPage })
      .then((res) => {
        if (id !== requestId.current) return;
        setItems((prev) => {
          const seen = new Set(prev.map((i) => `${i.id}-${i.mediaType}`));
          const additions = res.items.filter(
            (i) => !seen.has(`${i.id}-${i.mediaType}`),
          );
          return [...prev, ...additions];
        });
        setPage(res.page);
        setTotalPages(res.totalPages);
      })
      .catch((err) => console.error("Browse loadMore error:", err))
      .finally(() => {
        if (id === requestId.current) setLoadingMore(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMore, loading, page, totalPages, filterKey]);

  // ── Filter mutators (write to the URL) ──
  const patchParams = useCallback(
    (patch) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === "" || value == null) next.delete(key);
        else next.set(key, value);
      });
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const toggleGenre = useCallback(
    (genreId) => {
      const set = new Set(genres);
      set.has(genreId) ? set.delete(genreId) : set.add(genreId);
      patchParams({ genres: [...set].join(",") });
    },
    [genres, patchParams],
  );

  const setYear = useCallback((value) => patchParams({ year: value }), [patchParams]);
  const setSort = useCallback((value) => patchParams({ sort: value }), [patchParams]);
  const clearFilters = useCallback(
    () => setSearchParams({}, { replace: true }),
    [setSearchParams],
  );

  const hasActiveFilters = genres.length > 0 || !!year || sort !== DEFAULT_SORT;

  return {
    // data
    items,
    loading,
    loadingMore,
    error,
    hasMore: page < totalPages,
    loadMore,
    // filter state
    genres,
    year,
    sort,
    hasActiveFilters,
    // filter actions
    toggleGenre,
    setYear,
    setSort,
    clearFilters,
  };
}
