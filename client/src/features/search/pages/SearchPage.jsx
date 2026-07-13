import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, X, SearchX, Clapperboard } from "lucide-react";

import { useSearch } from "../hooks/useSearch";
import MediaCard from "../../media/components/MediaCard";
import PersonCard from "../components/PersonCard";

const GRID_STYLE = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fill, minmax(clamp(104px, 30vw, 150px), 1fr))",
  gap: "clamp(10px, 2vw, 18px)",
  padding: "8px 0 0",
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "Shows" },
  { value: "person", label: "People" },
];

function SkeletonGrid({ count = 12 }) {
  return (
    <div style={GRID_STYLE}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.28, 0.55, 0.28] }}
          transition={{
            duration: 1.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.04,
          }}
          style={{
            width: "100%",
            aspectRatio: "2/3",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-bg-elevated)",
          }}
        />
      ))}
    </div>
  );
}

function CenteredState({ icon: Icon, title, subtitle }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        minHeight: "40vh",
        textAlign: "center",
        padding: 24,
      }}
    >
      <Icon style={{ width: 34, height: 34, color: "var(--color-text-muted)" }} />
      <p style={{ fontSize: 15, color: "var(--color-text-secondary)", margin: 0 }}>
        {title}
      </p>
      {subtitle && (
        <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function SearchPage() {
  const {
    input,
    setInput,
    q,
    results,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    clear,
  } = useSearch();

  const [typeFilter, setTypeFilter] = useState("all");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const counts = results.reduce(
    (acc, item) => {
      acc.all += 1;
      if (item.media_type === "movie") acc.movie += 1;
      else if (item.media_type === "tv") acc.tv += 1;
      else if (item.media_type === "person") acc.person += 1;
      return acc;
    },
    { all: 0, movie: 0, tv: 0, person: 0 },
  );

  const visible =
    typeFilter === "all"
      ? results
      : results.filter((item) => item.media_type === typeFilter);

  const hasQuery = q.trim().length > 0;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        minHeight: "100svh",
        maxWidth: 1280,
        margin: "0 auto",
        padding: "22px 16px 90px",
      }}
    >
      {/* ── Search input ── */}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <Search
          style={{
            position: "absolute",
            left: 16,
            width: 18,
            height: 18,
            color: "var(--color-gold-dim)",
            pointerEvents: "none",
          }}
        />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search movies, shows, and people…"
          style={{
            width: "100%",
            background: "var(--color-bg-elevated)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-gold-border)",
            borderRadius: "var(--radius-xl)",
            padding: "15px 48px 15px 46px",
            fontSize: 16,
            outline: "none",
            fontFamily: "inherit",
            boxShadow: "0 0 0 3px var(--color-gold-glow)",
          }}
        />
        {input && (
          <button
            onClick={clear}
            style={{
              position: "absolute",
              right: 14,
              width: 26,
              height: 26,
              borderRadius: "var(--radius-full)",
              background: "var(--color-bg-overlay)",
              border: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X style={{ width: 14, height: 14, color: "var(--color-text-muted)" }} />
          </button>
        )}
      </div>

      {/* ── Type filter chips (only when there are results) ── */}
      {hasQuery && results.length > 0 && (
        <div
          className="scrollbar-hide"
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            marginTop: 16,
            marginBottom: 4,
          }}
        >
          {FILTERS.map((f) => {
            const n = counts[f.value === "all" ? "all" : f.value];
            if (f.value !== "all" && n === 0) return null;
            const active = typeFilter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                style={{
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  background: active
                    ? "var(--color-gold)"
                    : "var(--color-bg-elevated)",
                  border: `1px solid ${
                    active ? "var(--color-gold)" : "var(--color-border)"
                  }`,
                  color: active ? "var(--color-bg)" : "var(--color-text-secondary)",
                  fontSize: 12,
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {f.label}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    opacity: active ? 0.75 : 0.55,
                  }}
                >
                  {n}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Results ── */}
      <div style={{ marginTop: 16 }}>
        {!hasQuery ? (
          <CenteredState
            icon={Clapperboard}
            title="Search CinemaVerse"
            subtitle="Find movies, TV shows, and the people who make them."
          />
        ) : loading ? (
          <SkeletonGrid />
        ) : results.length === 0 ? (
          <CenteredState
            icon={SearchX}
            title={`No results for “${q}”`}
            subtitle="Check the spelling or try a different title or name."
          />
        ) : (
          <>
            <div style={GRID_STYLE}>
              {visible.map((item, i) =>
                item.media_type === "person" ? (
                  <PersonCard key={`person-${item.id}`} person={item} index={i % 12} />
                ) : (
                  <MediaCard
                    key={`${item.media_type}-${item.id}`}
                    item={item}
                    index={i % 12}
                    mediaType={item.media_type}
                    fluid
                  />
                ),
              )}
            </div>

            {hasMore && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "28px 16px 8px",
                }}
              >
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{
                    padding: "10px 22px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-gold-glow)",
                    border: "1px solid var(--color-gold-border)",
                    color: "var(--color-gold)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    cursor: loadingMore ? "default" : "pointer",
                    fontFamily: "inherit",
                    opacity: loadingMore ? 0.7 : 1,
                  }}
                >
                  {loadingMore ? "Loading…" : "Load more"}
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.main>
  );
}
