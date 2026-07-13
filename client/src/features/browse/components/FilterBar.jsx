import { motion } from "framer-motion";
import { X } from "lucide-react";

import { getGenresFor } from "../config/genres";
import { SORT_OPTIONS, YEAR_OPTIONS } from "../config/sortOptions";

/**
 * FilterBar — sticky, minimal filter row for the Browse grid.
 * Genre chips (multi-select) · Sort segmented control · Year select · Clear.
 * All state is owned by useBrowse (URL-synced); this is a controlled component.
 */
export default function FilterBar({
  mediaType,
  genres,
  year,
  sort,
  hasActiveFilters,
  toggleGenre,
  setYear,
  setSort,
  clearFilters,
}) {
  const genreList = getGenresFor(mediaType);
  const activeGenres = new Set(genres);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(9,9,11,0.82)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border-subtle)",
        padding: "12px 16px 10px",
      }}
    >
      {/* ── Row 1: Sort + Year + Clear ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 10,
        }}
      >
        {/* Sort segmented control */}
        <div
          style={{
            display: "inline-flex",
            padding: 3,
            gap: 2,
            borderRadius: "var(--radius-full)",
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
          }}
        >
          {SORT_OPTIONS.map((opt) => {
            const active = sort === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                style={{
                  position: "relative",
                  padding: "5px 12px",
                  borderRadius: "var(--radius-full)",
                  border: "none",
                  background: "transparent",
                  color: active
                    ? "var(--color-bg)"
                    : "var(--color-text-muted)",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "color 0.2s",
                }}
              >
                {active && (
                  <motion.span
                    layoutId={`sort-pill-${mediaType}`}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "var(--radius-full)",
                      background: "var(--color-gold)",
                      zIndex: 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span style={{ position: "relative", zIndex: 1 }}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Year select */}
        <div style={{ position: "relative" }}>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{
              appearance: "none",
              padding: "6px 30px 6px 12px",
              borderRadius: "var(--radius-full)",
              background: year
                ? "var(--color-gold-glow)"
                : "var(--color-bg-elevated)",
              border: `1px solid ${
                year ? "var(--color-gold-border)" : "var(--color-border)"
              }`,
              color: year ? "var(--color-gold)" : "var(--color-text-secondary)",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              outline: "none",
            }}
          >
            <option value="">All years</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <span
            style={{
              position: "absolute",
              right: 11,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              fontSize: 9,
              color: "var(--color-text-muted)",
            }}
          >
            ▾
          </span>
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.94 }}
            onClick={clearFilters}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 12px",
              borderRadius: "var(--radius-full)",
              background: "transparent",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-muted)",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <X style={{ width: 12, height: 12 }} />
            Clear
          </motion.button>
        )}
      </div>

      {/* ── Row 2: Genre chips ── */}
      <div
        className="scrollbar-hide"
        style={{
          display: "flex",
          gap: 7,
          overflowX: "auto",
          paddingBottom: 2,
        }}
      >
        {genreList.map((genre) => {
          const active = activeGenres.has(genre.id);
          return (
            <button
              key={genre.id}
              onClick={() => toggleGenre(genre.id)}
              style={{
                flexShrink: 0,
                padding: "5px 12px",
                borderRadius: "var(--radius-full)",
                background: active
                  ? "var(--color-gold)"
                  : "var(--color-bg-elevated)",
                border: `1px solid ${
                  active ? "var(--color-gold)" : "var(--color-border)"
                }`,
                color: active
                  ? "var(--color-bg)"
                  : "var(--color-text-secondary)",
                fontSize: 11,
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                transition: "background 0.18s, border-color 0.18s, color 0.18s",
              }}
            >
              {genre.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
