import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { getMovieDetails } from "../../../features/movies/movie.api";
import { getTVDetails } from "../../../features/tv/tv.api";

import DetailHero from "../components/DetailHero";
import DetailMeta from "../components/DetailMeta";
import DetailOverview from "../components/DetailOverview";
import DetailProduction from "../components/DetailProduction";
import DetailSeasons from "../components/DetailSeasons";
import DetailLastEpisode from "../components/DetailLastEpisode";
import { useBookmarks } from "../../bookmark/context/BookmarkContext";
import ReviewSection from "../../review/components/ReviewSection";

/* ── Loading skeleton ── */
function LoadingSkeleton() {
  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Backdrop skeleton */}
      <div
        className="shimmer"
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
            className="shimmer"
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
        @keyframes shimmer {
          0%   { opacity: 0.4; }
          50%  { opacity: 0.75; }
          100% { opacity: 0.4; }
        }
        .shimmer { animation: shimmer 1.6s ease-in-out infinite; }
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

/* ── Main ── */
export default function DetailPage() {
  // Route expects /movie/:id  or  /tv/:id
  const { type, id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { bookmarks, toggle } = useBookmarks();
  const isTV = type === "tv";
  const isBookmarked = bookmarks.some(
    (b) => b.mediaId === Number(id) && b.mediaType === type,
  );

  useEffect(() => {
    if (!id || !type) return;
    setLoading(true);
    setData(null);
    setError(null);

    const fetch = isTV ? getTVDetails : getMovieDetails;

    fetch(id)
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Could not load details. Please try again.");
        toast.error("Failed to load details.");
      })
      .finally(() => setLoading(false));
  }, [id, type]);

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

  const title = isTV ? data.name : data.title;
  const homepage = data.homepage;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${type}-${id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        /* pb-24 on mobile so bottom nav doesn't cover content */
        style={{ paddingBottom: 96, background: "var(--color-bg)" }}
      >
        {/* ── Back button ── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background:
              "rgba(9,9,11,0)" /* transparent; hero backdrop shows through */,
            pointerEvents: "none",
          }}
        >
          <button
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
          </button>

          <button
            onClick={() =>
              toggle({
                id: Number(id),
                media_type: type,
              })
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 13px",
              borderRadius: "var(--radius-full)",
              background: "rgba(9,9,11,0.72)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--color-border)",
              color: isBookmarked
                ? "var(--color-gold)"
                : "var(--color-text-secondary)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              pointerEvents: "all",
            }}
          >
            {isBookmarked ? "❤️ Bookmarked" : "🤍 Bookmark"}
          </button>

          {homepage && (
            <a
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
              <ExternalLink className="w-3.5 h-3.5" />
              Official Site
            </a>
          )}
        </div>

        {/* ── Hero (backdrop + poster + title) ── */}
        <div style={{ marginTop: -48 }}>
          {" "}
          {/* pull up behind back button */}
          <DetailHero data={data} type={type} />
        </div>

        {/* ── Body content ── */}
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "24px 16px 0",
          }}
        >
          {/* Meta pills: runtime / episodes / budget / status */}
          <DetailMeta data={data} type={type} />
          <Divider />

          {/* Synopsis + languages */}
          <DetailOverview data={data} />
          <Divider />

          {/* TV: last episode aired */}
          {isTV && data.last_episode_to_air && (
            <>
              <DetailLastEpisode episode={data.last_episode_to_air} />
              <Divider />
            </>
          )}

          {/* TV: seasons grid */}
          {isTV && data.seasons?.length > 0 && (
            <>
              <DetailSeasons seasons={data.seasons} />
              <Divider />
            </>
          )}

          {/* Production companies / networks / creators */}
          <DetailProduction data={data} type={type} />
          <Divider />
          <ReviewSection mediaId={id} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
