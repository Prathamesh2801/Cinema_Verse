import { motion } from "framer-motion";
import { Film, Tv2 } from "lucide-react";

import { useBrowse } from "../hooks/useBrowse";
import FilterBar from "../components/FilterBar";
import MediaGrid from "../components/MediaGrid";

/**
 * BrowsePage — shared filterable poster grid for the Movies and TV tabs.
 * Driven entirely by the mediaType prop ("movie" | "tv").
 */
export default function BrowsePage({ mediaType }) {
  const browse = useBrowse(mediaType);

  const isTV = mediaType === "tv";
  const Icon = isTV ? Tv2 : Film;
  const title = isTV ? "TV Shows" : "Movies";

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: "100svh", paddingBottom: 80 }}
    >
      {/* ── Page header ── */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "18px 16px 4px",
          display: "flex",
          alignItems: "center",
          gap: 9,
        }}
      >
        <Icon style={{ width: 18, height: 18, color: "var(--color-gold)" }} />
        <h1
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--color-text-primary)",
            margin: 0,
          }}
        >
          Browse {title}
        </h1>
      </div>

      {/* ── Filters ── */}
      <FilterBar
        mediaType={mediaType}
        genres={browse.genres}
        year={browse.year}
        sort={browse.sort}
        hasActiveFilters={browse.hasActiveFilters}
        toggleGenre={browse.toggleGenre}
        setYear={browse.setYear}
        setSort={browse.setSort}
        clearFilters={browse.clearFilters}
      />

      {/* ── Grid ── */}
      <MediaGrid
        items={browse.items}
        loading={browse.loading}
        loadingMore={browse.loadingMore}
        hasMore={browse.hasMore}
        loadMore={browse.loadMore}
      />
    </motion.main>
  );
}
