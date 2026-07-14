import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ImageOff, Bookmark, BookmarkCheck, Trash2 } from "lucide-react";
import { useBookmarks } from "../../bookmark/context/BookmarkContext";
import { useAuth } from "../../auth/context/AuthContext"; // adjust path to your auth context
import { getImageUrl, IMAGE_SIZES } from "../../../utils/image";
import toast from "react-hot-toast";

/**
 * MediaCard
 *
 * Props:
 *   item          — TMDB item (needs id, media_type, poster, title/name, etc.)
 *   index         — stagger animation index
 *   mediaType     — "movie" | "tv"  explicit override when item.media_type is absent
 *   showRemove    — boolean  when true shows a full "Remove" button instead of the
 *                   bookmark toggle (used in BookmarkPage)
 *   fluid         — boolean  when true the card fills its container (grid cell)
 *                   instead of the fixed 130px used in horizontal rows
 *
 * Field reads are normalized-first with a raw-TMDB fallback, so the card works
 * with both normalizeMedia() output (poster/rating/year) and raw items
 * (poster_path/vote_average/release_date).
 */
const STATUS_BADGE = {
  want: { label: "Watchlist", color: "var(--color-gold)" },
  watching: { label: "Watching", color: "var(--color-royal-bright)" },
  watched: { label: "Watched", color: "#4ade80" },
};

export default function MediaCard({
  item,
  index = 0,
  mediaType,
  showRemove = false,
  fluid = false,
  statusBadge = null,
}) {
  const navigate = useNavigate();
  const { bookmarks, toggle } = useBookmarks();
  const { user } = useAuth(); // null when logged out

  const title = item.title || item.name;
  const poster = item.poster || item.poster_path;
  const year =
    item.year || (item.release_date || item.first_air_date || "").slice(0, 4);
  const ratingValue = item.rating ?? item.vote_average;
  const rating =
    ratingValue != null ? Number(ratingValue).toFixed(1) : undefined;
  const hasPoster = !!poster;

  const resolvedType =
    mediaType ||
    item.mediaType ||
    item.media_type ||
    (item.title ? "movie" : "tv");

  const isBookmarked = bookmarks.some(
    (b) => b.mediaId === item.id && b.mediaType === resolvedType,
  );

  const handleCardClick = () => navigate(`/${resolvedType}/${item.id}`);

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.custom(
        () => (
          <div
            style={{
              background: "var(--color-bg-overlay)",
              border: "1px solid var(--color-gold-border)",
              borderRadius: "var(--radius-lg)",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px var(--color-gold-border)",
              color: "var(--color-text-secondary)",
              fontSize: 13,
              fontWeight: 500,
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ fontSize: 16 }}>🔐</span>

            <span>
              <span style={{ color: "var(--color-gold)", fontWeight: 700 }}>
                Please sign in
              </span>{" "}
              to save bookmarks
            </span>
          </div>
        ),
        { duration: 2500 },
      );

      navigate("/login");

      return;
    }
    toggle({ id: item.id, media_type: resolvedType });
  };

  /* ── Bookmark / Remove button ── */
  const ActionButton = () => {
    if (showRemove) {
      return (
        <motion.button
          whileTap={{ scale: 0.86 }}
          onClick={handleBookmark}
          title="Remove from library"
          className="lib-remove-btn"
        >
          <Trash2 style={{ width: 13, height: 13 }} />
        </motion.button>
      );
    }

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
          background: isBookmarked ? "var(--color-gold)" : "rgba(9,9,11,0.72)",
          backdropFilter: "blur(6px)",
          border: `1px solid ${
            isBookmarked ? "var(--color-gold)" : "var(--color-border)"
          }`,
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
              initial={{ scale: 0.4, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.18, type: "spring", stiffness: 300 }}
            >
              <BookmarkCheck
                style={{
                  width: 13,
                  height: 13,
                  color: "var(--color-bg)",
                  strokeWidth: 2.5,
                }}
              />
            </motion.span>
          ) : (
            <motion.span
              key="unsaved"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Bookmark
                style={{
                  width: 13,
                  height: 13,
                  color: "var(--color-text-secondary)",
                  strokeWidth: 2,
                }}
              />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{
        duration: 0.32,
        delay: index * 0.045,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      className="group relative cursor-pointer"
      style={
        fluid
          ? { width: "100%" }
          : { minWidth: 130, width: 130, flexShrink: 0 }
      }
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
          e.currentTarget.style.boxShadow = "0 8px 28px var(--color-gold-glow)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Poster image */}
        {hasPoster ? (
          <img
            src={getImageUrl(poster, IMAGE_SIZES.small)}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff
              className="w-8 h-8"
              style={{ color: "var(--color-text-muted)" }}
            />
          </div>
        )}

        {/* Library status badge (top-left) */}
        {statusBadge && STATUS_BADGE[statusBadge] && (
          <div
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "rgba(9,9,11,0.82)",
              backdropFilter: "blur(6px)",
              borderRadius: "var(--radius-sm)",
              padding: "2px 7px",
              border: `1px solid ${STATUS_BADGE[statusBadge].color}55`,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: STATUS_BADGE[statusBadge].color,
              }}
            />
            <span
              style={{
                fontSize: 8.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: STATUS_BADGE[statusBadge].color,
              }}
            >
              {STATUS_BADGE[statusBadge].label}
            </span>
          </div>
        )}

        {/* Hover gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(to top, rgba(9,9,11,0.92) 0%, transparent 60%)",
          }}
        />

        {/* "View Details" label on hover */}
        {!showRemove && (
          <div
            className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              padding: "8px 6px 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
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

        {/* Star rating — top-right (hidden in library mode; the remove icon lives there) */}
        {!showRemove && rating && parseFloat(rating) > 0 && (
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
            <Star
              className="w-2.5 h-2.5"
              style={{
                fill: "var(--color-rating)",
                color: "var(--color-rating)",
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--color-rating)",
              }}
            >
              {rating}
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
          <p
            style={{
              fontSize: 10,
              color: "var(--color-text-muted)",
              marginTop: 2,
            }}
          >
            {year}
          </p>
        )}
      </div>

      {/* Scoped styles */}
      <style>{`
        .lib-remove-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 26px;
          height: 26px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(9, 9, 11, 0.6);
          backdrop-filter: blur(6px);
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          cursor: pointer;
          z-index: 3;
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 0.18s, transform 0.18s, background 0.18s,
            border-color 0.18s, color 0.18s;
        }
        /* Reveal on card hover; keep it visible on touch (no hover) devices */
        .group:hover .lib-remove-btn { opacity: 1; transform: scale(1); }
        @media (hover: none) {
          .lib-remove-btn { opacity: 0.9; transform: scale(1); }
        }
        .lib-remove-btn:hover {
          background: rgba(239, 68, 68, 0.92);
          border-color: rgba(239, 68, 68, 0.92);
          color: #fff;
        }
      `}</style>
    </motion.div>
  );
}
