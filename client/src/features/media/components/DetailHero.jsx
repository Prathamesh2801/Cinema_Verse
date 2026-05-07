import { motion } from "framer-motion";
import { Star, Calendar, Globe } from "lucide-react";
import { getImageUrl, IMAGE_SIZES } from "../../../utils/image";

/* Formats "2024-02-27" → "Feb 27, 2024" */
function fmtDate(str) {
  if (!str) return null;
  return new Date(str).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DetailHero({ data, type }) {
  const isTV   = type === "tv";
  const title  = isTV ? data.name  : data.title;
  const date   = isTV ? data.first_air_date : data.release_date;
  const rating = data.vote_average?.toFixed(1);
  const genres = data.genres ?? [];

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>

      {/* ── Backdrop ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        {data.backdrop_path ? (
          <img
            src={getImageUrl(data.backdrop_path, IMAGE_SIZES.large)}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        ) : null}
        {/* Multi-layer gradient so content is always legible */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(9,9,11,0.35) 0%, rgba(9,9,11,0.65) 40%, rgba(9,9,11,0.97) 80%, var(--color-bg) 100%)",
          }}
        />
        {/* Left-side vignette for poster contrast */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(9,9,11,0.85) 0%, transparent 55%)",
          }}
        />
        {/* Gold ambient glow */}
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "var(--color-gold-glow)",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 24px 40px",
          display: "flex",
          gap: 36,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        {/* Poster */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ flexShrink: 0 }}
        >
          <div
            style={{
              width: "clamp(130px, 18vw, 220px)",
              aspectRatio: "2/3",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              border: "2px solid var(--color-gold-border)",
              boxShadow:
                "0 0 0 1px var(--color-gold-border), 0 24px 64px rgba(0,0,0,0.6), 0 0 40px var(--color-gold-glow)",
              background: "var(--color-bg-elevated)",
            }}
          >
            <img
              src={getImageUrl(data.poster_path, IMAGE_SIZES.medium)}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: 1, minWidth: 0 }}
        >
          {/* Type badge */}
          {/* <div style={{ marginBottom: 10 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 9,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                background: isTV ? "var(--color-royal-dim)" : "var(--color-gold-glow)",
                border: `1px solid ${isTV ? "var(--color-royal-border)" : "var(--color-gold-border)"}`,
                color: isTV ? "var(--color-text-royal)" : "var(--color-gold)",
              }}
            >
              {isTV ? "TV Series" : "Movie"}
            </span>
          </div> */}

          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(22px, 5vw, 46px)",
              fontWeight: 900,
              color: "var(--color-text-primary)",
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
              marginBottom: 6,
            }}
          >
            {title}
          </h1>

          {/* Tagline */}
          {data.tagline && (
            <p
              style={{
                fontSize: "clamp(12px, 1.5vw, 15px)",
                color: "var(--color-gold-dim)",
                fontStyle: "italic",
                marginBottom: 14,
                letterSpacing: "0.01em",
              }}
            >
              "{data.tagline}"
            </p>
          )}

          {/* Genres */}
          {genres.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {genres.map((g) => (
                <span
                  key={g.id}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-bg-overlay)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-secondary)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Rating + date row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {/* Star rating */}
            {rating && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(9,9,11,0.7)",
                  border: "1px solid var(--color-gold-border)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Star
                  className="w-4 h-4"
                  style={{ fill: "var(--color-rating)", color: "var(--color-rating)" }}
                />
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "var(--color-rating)",
                    lineHeight: 1,
                  }}
                >
                  {rating}
                </span>
                <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>
                  / 10
                </span>
              </div>
            )}

            {/* Date */}
            {date && (
              <div
                style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--color-text-muted)", fontSize: 13 }}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{fmtDate(date)}</span>
              </div>
            )}

            {/* Language */}
            {data.original_language && (
              <div
                style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--color-text-muted)", fontSize: 13 }}
              >
                <Globe className="w-3.5 h-3.5" />
                <span style={{ textTransform: "uppercase" }}>{data.original_language}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
