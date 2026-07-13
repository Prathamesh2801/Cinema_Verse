/* This is a data-fetching hook: it intentionally resets state inside effects
   keyed on the query. Opt out of the (overly strict) set-state-in-effect rule. */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { searchMedia } from "../search.api";

function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const keyOf = (i) => `${i.media_type}-${i.id}`;

// Drives the dedicated /search page. Query lives in the URL (?q=) so results are
// shareable and survive refresh; typing is debounced before it hits the URL/API.
export function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const [input, setInput] = useState(q);
  const debounced = useDebounce(input, 350);

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const reqId = useRef(0);

  // Push the debounced input into the URL (which is the source of truth).
  useEffect(() => {
    if (debounced !== q) {
      setSearchParams(debounced ? { q: debounced } : {}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Fetch page 1 whenever the committed query changes.
  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    const id = ++reqId.current;
    setLoading(true);

    searchMedia(q, 1)
      .then((r) => {
        if (id !== reqId.current) return;
        setResults(r.results);
        setPage(r.page);
        setTotalPages(r.totalPages);
      })
      .catch(() => {
        if (id === reqId.current) setResults([]);
      })
      .finally(() => {
        if (id === reqId.current) setLoading(false);
      });
  }, [q]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading || page >= totalPages || !q.trim()) return;
    const id = reqId.current;
    const nextPage = page + 1;
    setLoadingMore(true);

    searchMedia(q, nextPage)
      .then((r) => {
        if (id !== reqId.current) return;
        setResults((prev) => {
          const seen = new Set(prev.map(keyOf));
          return [...prev, ...r.results.filter((i) => !seen.has(keyOf(i)))];
        });
        setPage(r.page);
        setTotalPages(r.totalPages);
      })
      .catch(() => {})
      .finally(() => {
        if (id === reqId.current) setLoadingMore(false);
      });
  }, [loadingMore, loading, page, totalPages, q]);

  const clear = useCallback(() => {
    setInput("");
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return {
    input,
    setInput,
    q,
    results,
    loading,
    loadingMore,
    hasMore: page < totalPages,
    loadMore,
    clear,
  };
}
