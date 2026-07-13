import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

import MediaCard from "../../media/components/MediaCard";

const GRID_STYLE = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(clamp(104px, 30vw, 150px), 1fr))",
  gap: "clamp(10px, 2vw, 18px)",
  padding: "20px 16px 0",
  maxWidth: 1280,
  margin: "0 auto",
};

function SkeletonGrid({ count = 18 }) {
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

function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        minHeight: "40vh",
        padding: 24,
        textAlign: "center",
      }}
    >
      <SearchX style={{ width: 32, height: 32, color: "var(--color-text-muted)" }} />
      <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0 }}>
        No titles match these filters
      </p>
      <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: 0 }}>
        Try removing a genre or widening the year.
      </p>
    </div>
  );
}

export default function MediaGrid({
  items,
  loading,
  loadingMore,
  hasMore,
  loadMore,
}) {
  if (loading) return <SkeletonGrid />;
  if (!items.length) return <EmptyState />;

  return (
    <>
      <div style={GRID_STYLE}>
        {items.map((item, i) => (
          <MediaCard
            key={`${item.id}-${item.mediaType}`}
            item={item}
            index={i % 12}
            mediaType={item.mediaType}
            fluid
          />
        ))}
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
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
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
            {loadingMore ? (
              <>
                <span
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: "var(--radius-full)",
                    border: "2px solid var(--color-gold-border)",
                    borderTopColor: "var(--color-gold)",
                    animation: "spin 0.7s linear infinite",
                    display: "inline-block",
                  }}
                />
                Loading…
              </>
            ) : (
              "Load more"
            )}
          </motion.button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </>
  );
}
