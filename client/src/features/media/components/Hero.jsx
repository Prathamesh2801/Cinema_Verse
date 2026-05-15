import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bookmark, BookmarkCheck, Info, Star } from "lucide-react";
import { useBookmarks } from "../../bookmark/context/BookmarkContext";
import { useAuth } from "../../auth/context/AuthContext";
import toast from "react-hot-toast";

import { getImageUrl, IMAGE_SIZES } from "../../../utils/image";

// matches Tailwind max-w-7xl = 1280px
const CONTENT_MAX_W = 1280;

export default function Hero({ media }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookmarks, toggle } = useBookmarks();

  if (!media) return null;

  const resolvedType = media.mediaType || (media.title ? "movie" : "tv");
  const isBookmarked = bookmarks.some(
    (bookmark) => bookmark.mediaId === media.id && bookmark.mediaType === resolvedType,
  );

  const handleMoreInfo = () => {
    navigate(`/${resolvedType}/${media.id}`);
  };

  const handleToggleBookmark = () => {
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
              boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px var(--color-gold-border)",
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

    toggle({ id: media.id, media_type: resolvedType });
  };

  return (
    <section
      style={{
        position: "relative",
        // Mobile ~58vh (~420px min), desktop caps at 660px — no more giant top space
        height: "clamp(420px, 58vh, 660px)",
        overflow: "hidden",
      }}
    >
      {/* ── BACKDROP — crossfade on media change ─────────────────── */}
      <AnimatePresence mode="sync">
        <motion.img
          key={media.id ?? media.title}
          src={getImageUrl(media.backdrop, IMAGE_SIZES.full)}
          alt={media.title}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            // Focus on upper portion of image — faces / subject stay visible
            objectPosition: "center 18%",
            willChange: "opacity, transform",
          }}
        />
      </AnimatePresence>

      {/* ── OVERLAY: top fade → blends into navbar ───────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(9,9,11,0.55) 0%, transparent 20%)",
          zIndex: 1,
        }}
      />

      {/* ── OVERLAY: left gradient → content legibility ──────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(9,9,11,0.96) 0%, rgba(9,9,11,0.72) 38%, rgba(9,9,11,0.2) 65%, transparent 100%)",
          zIndex: 1,
        }}
      />

      {/* ── OVERLAY: bottom fade → rows blend in seamlessly ─────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(9,9,11,1) 0%, rgba(9,9,11,0.55) 18%, transparent 48%)",
          zIndex: 1,
        }}
      />

      {/* ── CONTENT ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={media.id ?? media.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          {/* max-w-7xl centering shell — same as rest of page */}
          <div
            style={{
              width: "100%",
              maxWidth: CONTENT_MAX_W,
              margin: "0 auto",
              padding: "0 clamp(16px, 3.5vw, 40px)",
              paddingBottom: "clamp(28px, 4.5vh, 48px)",
            }}
          >
            {/* Left column — readable max width */}
            <div style={{ maxWidth: 540 }}>
              {/* ── Badge ── */}
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.36 }}
                style={{
                  color: "var(--color-gold)",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 9,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Star
                  size={10}
                  fill="currentColor"
                  strokeWidth={0}
                  aria-hidden
                />
                Featured Tonight
              </motion.p>

              {/* ── Title ── */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.42 }}
                style={{
                  fontSize: "clamp(26px, 4vw, 54px)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  marginBottom: 10,
                  color: "#fff",
                  letterSpacing: "-0.025em",
                  textShadow: "0 2px 18px rgba(0,0,0,0.45)",
                }}
              >
                {media.title}
              </motion.h1>

              {/* ── Meta row ── */}
              {(media.year || media.genre || media.rating) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.28, duration: 0.36 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {media.rating && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: "var(--color-gold)",
                        fontSize: 12.5,
                        fontWeight: 700,
                      }}
                    >
                      <Star
                        size={11}
                        fill="currentColor"
                        strokeWidth={0}
                        aria-hidden
                      />
                      {media.rating}
                    </span>
                  )}
                  {media.rating && (media.year || media.genre) && (
                    <span
                      style={{ color: "rgba(255,255,255,0.28)", fontSize: 11 }}
                    >
                      •
                    </span>
                  )}
                  {media.year && (
                    <span
                      style={{
                        color: "rgba(255,255,255,0.52)",
                        fontSize: 12.5,
                      }}
                    >
                      {media.year}
                    </span>
                  )}
                  {media.year && media.genre && (
                    <span
                      style={{ color: "rgba(255,255,255,0.28)", fontSize: 11 }}
                    >
                      •
                    </span>
                  )}
                  {media.genre && (
                    <span
                      style={{
                        color: "rgba(255,255,255,0.52)",
                        fontSize: 12.5,
                      }}
                    >
                      {media.genre}
                    </span>
                  )}
                </motion.div>
              )}

              {/* ── Overview — hidden on xs, visible sm+ ── */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32, duration: 0.42 }}
                className="hidden sm:block"
                style={{
                  color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.65,
                  fontSize: "clamp(12.5px, 1.35vw, 14px)",
                  textShadow: "0 1px 6px rgba(0,0,0,0.55)",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {media.overview}
              </motion.p>

              {/* ── CTA Buttons ── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.4 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 18,
                  flexWrap: "wrap",
                }}
              >
                {/* Watch Now */}
                {/* <motion.button
                  whileHover={{ scale: 1.04, opacity: 0.9 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  style={{
                    background: "var(--color-gold)",
                    color: "#09090b",
                    border: "none",
                    borderRadius: "var(--radius-full)",
                    padding: "10px 22px",
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <Play
                    size={13}
                    fill="currentColor"
                    strokeWidth={0}
                    aria-hidden
                  />
                  Watch Trailer
                </motion.button> */}

                {/* More Info */}
                <motion.button
                  type="button"
                  whileHover={{
                    scale: 1.04,
                    background: "rgba(255,255,255,0.2)",
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  onClick={handleMoreInfo}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: "var(--radius-full)",
                    padding: "10px 20px",
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <Info size={14} strokeWidth={2} aria-hidden />
                  More Info
                </motion.button>

                {/* Add to List / Bookmark toggle */}
                <motion.button
                  type="button"
                  whileHover={{
                    scale: 1.1,
                    background: "rgba(255,255,255,0.18)",
                  }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  onClick={handleToggleBookmark}
                  title={isBookmarked ? "Remove from My List" : "Add to My List"}
                  aria-label={isBookmarked ? "Remove from My List" : "Add to My List"}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: "var(--radius-full)",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    flexShrink: 0,
                  }}
                >
                  {isBookmarked ? (
                    <BookmarkCheck
                      size={16}
                      strokeWidth={2.2}
                      aria-hidden
                    />
                  ) : (
                    <Bookmark size={16} strokeWidth={2.2} aria-hidden />
                  )}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
