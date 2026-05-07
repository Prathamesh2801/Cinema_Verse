import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  LogIn,
} from "lucide-react";

import { getMovieDetails } from "../../../features/movies/movie.api";
import { getTVDetails } from "../../../features/tv/tv.api";

import DetailHero from "../components/DetailHero";
import DetailMeta from "../components/DetailMeta";
import DetailOverview from "../components/DetailOverview";
import DetailProduction from "../components/DetailProduction";
import DetailSeasons from "../components/DetailSeasons";
import DetailLastEpisode from "../components/DetailLastEpisode";
import { useBookmarks } from "../../bookmark/context/BookmarkContext";
import { useAuth } from "../../auth/context/AuthContext"; // adjust to your auth path
import ReviewSection from "../../review/components/ReviewSection";

/* ── Loading skeleton ── */
function LoadingSkeleton() {
  return (
    <div style={{ paddingBottom: 100 }}>
      <div
        className="shimmer-block"
        style={{
          width: "100%",
          height: "clamp(260px, 45vw, 420px)",
          background: "var(--color-bg-elevated)",
        }}
      />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>
        {[180, 120, 80, 240, 160].map((w, i) => (
          <div
            key={i}
            className="shimmer-block"
            style={{
              height: i === 0 ? 32 : i === 3 ? 80 : 16,
              width: `min(${w}px, 90%)`,
              borderRadius: "var(--radius-md)",
              background: "var(--color-bg-elevated)",
              marginBottom: 14,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes shimmer-pulse {
          0%   { opacity: 0.35; }
          50%  { opacity: 0.65; }
          100% { opacity: 0.35; }
        }
        .shimmer-block { animation: shimmer-pulse 1.6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

/* ── Divider ── */
function Divider() {
  return (
    <div
      style={{
        borderTop: "1px solid var(--color-border-subtle)",
        margin: "0 0 28px",
      }}
    />
  );
}

/* ── Bookmark button — auth-aware ── */
function BookmarkButton({ isBookmarked, onToggle, user, onSignIn }) {
  const [hovered, setHovered] = useState(false);

  if (!user) {
    /* Subtle sign-in prompt */
    return (
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={onSignIn}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 13px",
          borderRadius: "var(--radius-full)",
          background: "rgba(9,9,11,0.72)",
          backdropFilter: "blur(10px)",
          border: "1px solid var(--color-border)",
          color: hovered ? "var(--color-gold)" : "var(--color-text-muted)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          pointerEvents: "all",
          transition: "border-color 0.2s, color 0.2s",
          borderColor: hovered
            ? "var(--color-gold-border)"
            : "var(--color-border)",
        }}
      >
        <LogIn style={{ width: 13, height: 13 }} />
        Sign in to save
      </motion.button>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 13px",
        borderRadius: "var(--radius-full)",
        background: isBookmarked
          ? "var(--color-gold-glow)"
          : "rgba(9,9,11,0.72)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${isBookmarked ? "var(--color-gold-border)" : hovered ? "var(--color-gold-border)" : "var(--color-border)"}`,
        color: isBookmarked
          ? "var(--color-gold)"
          : hovered
            ? "var(--color-gold)"
            : "var(--color-text-secondary)",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        pointerEvents: "all",
        transition: "all 0.2s",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isBookmarked ? (
          <motion.span
            key="saved"
            initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.18, type: "spring", stiffness: 320 }}
            style={{ display: "flex" }}
          >
            <BookmarkCheck
              style={{ width: 13, height: 13, strokeWidth: 2.5 }}
            />
          </motion.span>
        ) : (
          <motion.span
            key="unsaved"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ display: "flex" }}
          >
            <Bookmark style={{ width: 13, height: 13, strokeWidth: 2 }} />
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isBookmarked ? "saved-label" : "unsaved-label"}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 4 }}
          transition={{ duration: 0.15 }}
        >
          {isBookmarked ? "Saved" : "Bookmark"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

/* ── Main ── */
export default function DetailPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { bookmarks, toggle } = useBookmarks();
  const { user } = useAuth();

  const isTV = type === "tv";
  const isBookmarked = bookmarks.some(
    (b) => b.mediaId === Number(id) && b.mediaType === type,
  );

  useEffect(() => {
    if (!id || !type) return;
    setLoading(true);
    setData(null);
    setError(null);

    const fetchFn = isTV ? getTVDetails : getMovieDetails;

    fetchFn(id)
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Could not load details. Please try again.");
        toast.error("Failed to load details.");
      })
      .finally(() => setLoading(false));
  }, [id, type]);

  const handleToggleBookmark = () => {
    toggle({ id: Number(id), media_type: type });
    toast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: "var(--color-bg-overlay)",
            border: "1px solid var(--color-gold-border)",
            borderRadius: "var(--radius-lg)",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "var(--color-text-secondary)",
            fontSize: 13,
            fontWeight: 500,
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}
        >
          <BookmarkCheck
            style={{ width: 15, height: 15, color: "var(--color-gold)" }}
          />
          <span>
            {isBookmarked ? (
              "Removed from bookmarks"
            ) : (
              <>
                <span style={{ color: "var(--color-gold)", fontWeight: 700 }}>
                  Saved
                </span>{" "}
                to bookmarks
              </>
            )}
          </span>
        </motion.div>
      ),
      { duration: 2200 },
    );
  };

  const handleSignInPrompt = useCallback(() => {
    toast.custom(() => (
      <div
        style={{
          background: "var(--color-bg-overlay)",
          border: "1px solid var(--color-gold-border)",
          borderRadius: "var(--radius-lg)",
          padding: "12px 16px",
          color: "var(--color-text-secondary)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
        }}
      >
        🔐 Please sign in to save bookmarks
      </div>
    ));

    navigate("/login");
  }, [navigate]);

  /* ── Loading ── */
  if (loading) return <LoadingSkeleton />;

  /* ── Error ── */
  if (error || !data) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 16,
          padding: 24,
        }}
      >
        <span style={{ fontSize: 32 }}>⚠️</span>
        <p
          style={{
            fontSize: 15,
            color: "var(--color-text-muted)",
            textAlign: "center",
          }}
        >
          {error ?? "Something went wrong."}
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            background: "var(--color-gold-glow)",
            border: "1px solid var(--color-gold-border)",
            color: "var(--color-gold)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const homepage = data.homepage;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${type}-${id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ paddingBottom: 96, background: "var(--color-bg)" }}
      >
        {/* ── Top bar ── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            background: "rgba(9,9,11,0)",
            pointerEvents: "none",
          }}
        >
          {/* Back */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => window.history.back()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 13px",
              borderRadius: "var(--radius-full)",
              background: "rgba(9,9,11,0.72)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              pointerEvents: "all",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-gold-border)";
              e.currentTarget.style.color = "var(--color-gold)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </motion.button>

          {/* Right side actions */}
          <div style={{ display: "flex", gap: 8, pointerEvents: "all" }}>
            {/* Bookmark — auth-aware */}
            <BookmarkButton
              isBookmarked={isBookmarked}
              user={user}
              onToggle={handleToggleBookmark}
              onSignIn={handleSignInPrompt}
            />

            {/* Official site */}
            {homepage && (
              <motion.a
                whileTap={{ scale: 0.93 }}
                href={homepage}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 13px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(9,9,11,0.72)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-secondary)",
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-gold-border)";
                  e.currentTarget.style.color = "var(--color-gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Site
              </motion.a>
            )}
          </div>
        </div>

        {/* ── Hero ── */}
        <div style={{ marginTop: -48 }}>
          <DetailHero data={data} type={type} />
        </div>

        {/* ── Body ── */}
        <div
          style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 16px 0" }}
        >
          <DetailMeta data={data} type={type} />
          <Divider />

          <DetailOverview data={data} />
          <Divider />

          {isTV && data.last_episode_to_air && (
            <>
              <DetailLastEpisode episode={data.last_episode_to_air} />
              <Divider />
            </>
          )}

          {isTV && data.seasons?.length > 0 && (
            <>
              <DetailSeasons seasons={data.seasons} />
              <Divider />
            </>
          )}

          <DetailProduction data={data} type={type} />
          <Divider />
          <ReviewSection mediaId={id} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
