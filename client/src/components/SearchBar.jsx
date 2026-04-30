import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Star, Loader2, ImageOff } from "lucide-react";
import { searchMulti } from "../features/search/search.api";

/* ── debounce hook ── */
function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchBar({ autoFocus = false, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);
  const debouncedQuery = useDebounce(query, 350);

  /* auto-focus */
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  /* fetch */
  const fetchResults = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await searchMulti(q);

      setResults(Array.isArray(data) ? data.slice(0, 8) : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(debouncedQuery);
  }, [debouncedQuery, fetchResults]);

  /* close on outside click */
  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const showDropdown =
    open && (loading || results.length > 0 || (query.length > 0 && !loading));

  const clear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const handleClose = () => {
    clear();
    setOpen(false);
    onClose?.();
  };

  return (
    /*
     * KEY FIX:
     * The wrapper uses position:relative but overflow:visible (default).
     * The dropdown uses position:fixed so it is never clipped by any
     * parent with overflow:hidden — not the sticky header, not the
     * animated motion.div. We measure the input position at render time.
     */
    <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
      {/* ── Input row ── */}
      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        <Search
          className="w-4 h-4 pointer-events-none"
          style={{
            position: "absolute",
            left: 12,
            color: open ? "var(--color-gold-dim)" : "var(--color-text-muted)",
            transition: "color 0.2s",
            zIndex: 1,
          }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search movies, shows, people…"
          style={{
            width: "100%",
            background: "var(--color-bg-elevated)",
            color: "var(--color-text-primary)",
            border: `1px solid ${open ? "var(--color-gold-border)" : "var(--color-border)"}`,
            borderRadius: "var(--radius-lg)",
            padding: "10px 80px 10px 38px",
            fontSize: 13,
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: open ? "0 0 0 3px var(--color-gold-glow)" : "none",
            fontFamily: "inherit",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 8,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {loading && (
            <Loader2
              className="w-4 h-4 animate-spin"
              style={{ color: "var(--color-gold-dim)" }}
            />
          )}
          {query && (
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={clear}
              style={{
                width: 22,
                height: 22,
                borderRadius: "var(--radius-full)",
                background: "var(--color-bg-overlay)",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X
                className="w-3 h-3"
                style={{ color: "var(--color-text-muted)" }}
              />
            </button>
          )}
          {onClose && (
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClose}
              style={{
                fontSize: 11,
                color: "var(--color-text-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 4px",
                fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ── Dropdown — position:absolute but parent overflow:visible ── */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              zIndex: 9999 /* always on top of everything */,
              background: "var(--color-bg-overlay)",
              border: "1px solid var(--color-gold-border)",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              boxShadow:
                "0 4px 6px -1px rgba(0,0,0,0.4), 0 20px 48px -8px rgba(0,0,0,0.7), 0 0 0 1px var(--color-gold-border)",
            }}
          >
            {/* Loading state */}
            {loading && results.length === 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "28px 16px",
                  color: "var(--color-text-muted)",
                  fontSize: 13,
                }}
              >
                <Loader2
                  className="w-4 h-4 animate-spin"
                  style={{ color: "var(--color-gold-dim)" }}
                />
                <span>Searching…</span>
              </div>
            )}

            {/* Empty state */}
            {!loading && query.length > 0 && results.length === 0 && (
              <div
                style={{
                  padding: "28px 16px",
                  textAlign: "center",
                  fontSize: 13,
                  color: "var(--color-text-muted)",
                }}
              >
                No results for{" "}
                <span style={{ color: "var(--color-text-secondary)" }}>
                  "{query}"
                </span>
              </div>
            )}

            {/* Results list */}
            {results.length > 0 && (
              <ul
                style={{
                  maxHeight: 420,
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                }}
              >
                {results.map((item, i) => (
                  <ResultRow key={item.id} item={item} index={i} />
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Individual result row ── */
function ResultRow({ item, index }) {
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average?.toFixed(1);
  const type = item.media_type;
  const hasPoster = !!item.poster_path;

  const badgeStyle =
    type === "movie"
      ? {
          background: "var(--color-royal-dim)",
          color: "var(--color-text-royal)",
          border: "1px solid var(--color-royal-border)",
        }
      : type === "tv"
        ? {
            background: "var(--color-gold-glow)",
            color: "var(--color-gold-dim)",
            border: "1px solid var(--color-gold-border)",
          }
        : {
            background: "var(--color-bg-elevated)",
            color: "var(--color-text-muted)",
            border: "1px solid var(--color-border)",
          };

  return (
    <motion.li
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18, delay: index * 0.025 }}
      style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
    >
      <a
        href={`/${type}/${item.id}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          textDecoration: "none",
          transition: "background 0.15s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(238,205,129,0.06)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {/* Poster thumbnail */}
        <div
          style={{
            width: 38,
            height: 54,
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            background: "var(--color-bg-elevated)",
            flexShrink: 0,
            border: "1px solid var(--color-border)",
          }}
        >
          {hasPoster ? (
            <img
              src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
              alt={title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              loading="lazy"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageOff
                className="w-4 h-4"
                style={{ color: "var(--color-text-muted)" }}
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--color-text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              margin: 0,
            }}
          >
            {title}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 3,
            }}
          >
            {year && (
              <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                {year}
              </span>
            )}
            {type && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "2px 6px",
                  borderRadius: "var(--radius-sm)",
                  ...badgeStyle,
                }}
              >
                {type === "tv" ? "TV" : type === "movie" ? "Film" : type}
              </span>
            )}
          </div>
          {item.overview && (
            <p
              style={{
                fontSize: 11,
                color: "var(--color-text-muted)",
                marginTop: 3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.4,
              }}
            >
              {item.overview}
            </p>
          )}
        </div>

        {/* Rating */}
        {rating && parseFloat(rating) > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexShrink: 0,
            }}
          >
            <Star
              className="w-3 h-3"
              style={{
                fill: "var(--color-rating)",
                color: "var(--color-rating)",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-rating)",
              }}
            >
              {rating}
            </span>
          </div>
        )}
      </a>
    </motion.li>
  );
}
