import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ImageOff, Bookmark, BookmarkCheck, Trash2 } from "lucide-react";
import { useBookmarks } from "../features/bookmark/context/BookmarkContext";
import { useAuth } from "../features/auth/context/AuthContext"; // adjust path to your auth context
import { getImageUrl, IMAGE_SIZES } from "../utils/image";
import toast from "react-hot-toast";

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
export default function MediaCard({
  item,
  index = 0,
  mediaType,
  showRemove = false,
}) {
  const navigate = useNavigate();
  const { bookmarks, toggle } = useBookmarks();
  const { user } = useAuth(); // null when logged out

  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average?.toFixed(1);
  const hasPoster = !!item.poster_path;

  const resolvedType =
    mediaType || item.media_type || (item.title ? "movie" : "tv");

  const isTV = resolvedType === "tv";

  const isBookmarked = bookmarks.some(
    (b) => b.mediaId === item.id && b.mediaType === resolvedType,
  );

  const handleCardClick = () => navigate(`/${resolvedType}/${item.id}`);

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.custom(
        (t) => (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
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
              cursor: "pointer",
            }}
            onClick={() => {
              toast.dismiss(t.id);
              navigate("/login");
            }}
          >
            <span style={{ fontSize: 16 }}>🔐</span>
            <span>
              <span style={{ color: "var(--color-gold)", fontWeight: 700 }}>
                Sign in
              </span>{" "}
              to save bookmarks
            </span>
          </motion.div>
        ),
        { duration: 3000 },
      );
      return;
    }
    toggle({ id: item.id, media_type: resolvedType });
  };

  /* ── Bookmark / Remove button ── */
  const ActionButton = () => {
    if (showRemove) {
      return (
        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.93 }}
          onClick={handleBookmark}
          title="Remove bookmark"
          className="bookmark-remove-btn"
        >
          <Trash2
            style={{ width: 11, height: 11, color: "#fff", flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.06em",
            }}
          >
            Remove
          </span>
        </motion.button>
      );
    }

    if (!user) {
      /* Subtle "sign in" hint — just a faded lock icon, no clutter */
      return (
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleBookmark}
          title="Sign in to bookmark"
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            width: 26,
            height: 26,
            borderRadius: "var(--radius-sm)",
            background: "rgba(9,9,11,0.60)",
            backdropFilter: "blur(6px)",
            border: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
            opacity: 0.55,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}
        >
          <span style={{ fontSize: 11 }}>🔒</span>
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
            src={getImageUrl(item.poster_path, IMAGE_SIZES.small)}
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

        {/* Media type badge */}
        {!showRemove && (
          <div
            className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              bottom: 28,
              left: 6,
              background: isTV
                ? "var(--color-royal-dim)"
                : "var(--color-gold-glow)",
              border: `1px solid ${isTV ? "var(--color-royal-border)" : "var(--color-gold-border)"}`,
              borderRadius: "var(--radius-sm)",
              padding: "2px 5px",
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
        .bookmark-remove-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 9px 6px;
          background: rgba(239, 68, 68, 0.82);
          backdrop-filter: blur(6px);
          border: none;
          border-top: 1px solid rgba(239,68,68,0.4);
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        }
        .bookmark-remove-btn:hover {
          background: rgba(220, 38, 38, 0.96);
        }
      `}</style>
    </motion.div>
  );
}
