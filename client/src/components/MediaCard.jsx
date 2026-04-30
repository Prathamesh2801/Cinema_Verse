import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ImageOff, Bookmark, BookmarkCheck, Trash2 } from "lucide-react";
import { useBookmarks } from "../features/bookmark/context/BookmarkContext";
import { getImageUrl, IMAGE_SIZES } from "../utils/image";

/**
 * MediaCard
 *
 * Props:
 *   item          — TMDB item (needs id, media_type, poster_path, title/name, etc.)
 *   index         — stagger animation index
 *   mediaType     — "movie" | "tv"  explicit override when item.media_type is absent
 *   showRemove    — boolean  when true shows a full "Remove" button instead of the
 *                   bookmark toggle (used in BookmarkPage)
 */
export default function MediaCard({ item, index = 0, mediaType, showRemove = false }) {
  const navigate  = useNavigate();
  const { bookmarks, toggle } = useBookmarks();

  const title    = item.title || item.name;
  const year     = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating   = item.vote_average?.toFixed(1);
  const hasPoster = !!item.poster_path;

  const resolvedType =
    mediaType ||
    item.media_type ||
    (item.title ? "movie" : "tv");

  const isTV = resolvedType === "tv";

  const isBookmarked = bookmarks.some(
    (b) => b.mediaId === item.id && b.mediaType === resolvedType,
  );

  const handleCardClick = () => navigate(`/${resolvedType}/${item.id}`);

  const handleBookmark = (e) => {
    e.stopPropagation();
    toggle({ id: item.id, media_type: resolvedType });
  };

  /* ── Bookmark / Remove button ── */
  const ActionButton = () => {
    if (showRemove) {
      /* BookmarkPage: prominent "Remove" strip at the bottom of poster */
      return (
        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.93 }}
          onClick={handleBookmark}
          title="Remove bookmark"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            padding: "8px 6px",
            background: "rgba(248,113,113,0.88)",
            backdropFilter: "blur(6px)",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.96)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.88)")}
        >
          <Trash2 style={{ width: 11, height: 11, color: "#fff", flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>
            Remove
          </span>
        </motion.button>
      );
    }

    /* Default: bookmark toggle pill — top-left, above the type badge */
    return (
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleBookmark}
        title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        style={{
          position: "absolute",
          top: 6,
          left: 6,
          width: 26,
          height: 26,
          borderRadius: "var(--radius-sm)",
          background: isBookmarked
            ? "var(--color-gold)"
            : "rgba(9,9,11,0.72)",
          backdropFilter: "blur(6px)",
          border: `1px solid ${isBookmarked ? "var(--color-gold)" : "var(--color-border)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 2,
          transition: "background 0.2s, border-color 0.2s",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isBookmarked ? (
            <motion.span
              key="saved"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <BookmarkCheck style={{ width: 13, height: 13, color: "var(--color-bg)", strokeWidth: 2.5 }} />
            </motion.span>
          ) : (
            <motion.span
              key="unsaved"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Bookmark style={{ width: 13, height: 13, color: "var(--color-text-secondary)", strokeWidth: 2 }} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative flex-shrink-0 cursor-pointer"
      style={{ minWidth: 130, width: 130 }}
    >
      {/* ── Poster ── */}
      <div
        onClick={handleCardClick}
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "2/3",
          borderRadius: "var(--radius-lg)",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          transition: "border-color 0.25s, box-shadow 0.25s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--color-gold-border)";
          e.currentTarget.style.boxShadow   = "0 8px 28px var(--color-gold-glow)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.boxShadow   = "none";
        }}
      >
        {/* Poster image */}
        {hasPoster ? (
          <img
            src={getImageUrl(item.poster_path, IMAGE_SIZES.small)}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-8 h-8" style={{ color: "var(--color-text-muted)" }} />
          </div>
        )}

        {/* Hover gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "linear-gradient(to top, rgba(9,9,11,0.85) 0%, transparent 55%)" }}
        />

        {/* "View Details" label on hover */}
        {!showRemove && (
          <div
            className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ padding: "8px 6px 6px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--color-gold)",
                background: "rgba(9,9,11,0.72)",
                backdropFilter: "blur(6px)",
                padding: "3px 8px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--color-gold-border)",
              }}
            >
              View Details
            </span>
          </div>
        )}

        {/* Bookmark / Remove action */}
        <ActionButton />

        {/* Star rating — top-right */}
        {rating && parseFloat(rating) > 0 && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1"
            style={{
              background: "rgba(9,9,11,0.80)",
              backdropFilter: "blur(6px)",
              borderRadius: "var(--radius-sm)",
              padding: "2px 6px",
              border: "1px solid var(--color-gold-border)",
            }}
          >
            <Star className="w-2.5 h-2.5" style={{ fill: "var(--color-rating)", color: "var(--color-rating)" }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-rating)" }}>{rating}</span>
          </div>
        )}

        {/* Media type badge — only shown when NOT showRemove (avoid clutter) */}
        {!showRemove && (
          <div
            className="absolute"
            style={{
              bottom: 28,    /* sits just above the "View Details" label */
              left: 6,
              background: isTV ? "var(--color-royal-dim)" : "var(--color-gold-glow)",
              border: `1px solid ${isTV ? "var(--color-royal-border)" : "var(--color-gold-border)"}`,
              borderRadius: "var(--radius-sm)",
              padding: "2px 5px",
              opacity: 0,
            }}
            ref={(el) => {
              /* show via group-hover via inline ref — simpler than another wrapper */
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: isTV ? "var(--color-text-royal)" : "var(--color-gold)",
              }}
            >
              {isTV ? "TV" : "Film"}
            </span>
          </div>
        )}
      </div>

      {/* ── Title + year ── */}
      <div onClick={handleCardClick} style={{ marginTop: 7, paddingLeft: 2 }}>
        <p
          className="line-clamp-2"
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--color-text-secondary)",
            lineHeight: 1.35,
            margin: 0,
          }}
        >
          {title}
        </p>
        {year && (
          <p style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 2 }}>{year}</p>
        )}
      </div>
    </motion.div>
  );
}