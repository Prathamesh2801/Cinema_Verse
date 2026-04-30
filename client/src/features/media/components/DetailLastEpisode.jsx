import { motion } from "framer-motion";
import { Clapperboard, Star } from "lucide-react";
import { getImageUrl, IMAGE_SIZES } from "../../../utils/image";

function fmtDate(str) {
  if (!str) return null;
  return new Date(str).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function DetailLastEpisode({ episode }) {
  if (!episode) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      style={{ marginBottom: 32 }}
    >
      {/* Heading */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Clapperboard className="w-4 h-4" style={{ color: "var(--color-gold-dim)" }} />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "var(--color-text-muted)",
          }}
        >
          Last Episode
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
          padding: "14px",
          borderRadius: "var(--radius-lg)",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          flexWrap: "wrap",
        }}
      >
        {/* Still */}
        {episode.still_path && (
          <div
            style={{
              flexShrink: 0,
              width: "clamp(100px, 22vw, 180px)",
              aspectRatio: "16/9",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-overlay)",
            }}
          >
            <img
              src={getImageUrl(episode.still_path, IMAGE_SIZES.small)}
              alt={episode.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              loading="lazy"
            />
          </div>
        )}

        {/* Info */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 6,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                padding: "2px 7px",
                borderRadius: "var(--radius-sm)",
                background: "var(--color-royal-dim)",
                border: "1px solid var(--color-royal-border)",
                color: "var(--color-text-royal)",
              }}
            >
              S{episode.season_number} E{episode.episode_number}
            </span>

            {episode.episode_type === "finale" && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  padding: "2px 7px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-gold-glow)",
                  border: "1px solid var(--color-gold-border)",
                  color: "var(--color-gold)",
                }}
              >
                Finale
              </span>
            )}

            {episode.vote_average > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 3, marginLeft: "auto" }}>
                <Star className="w-3 h-3" style={{ fill: "var(--color-rating)", color: "var(--color-rating)" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-rating)" }}>
                  {episode.vote_average.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)", margin: "0 0 5px", lineHeight: 1.2 }}>
            {episode.name}
          </p>

          {episode.overview && (
            <p
              style={{
                fontSize: 12,
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
                margin: "0 0 8px",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {episode.overview}
            </p>
          )}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {episode.air_date && (
              <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                Aired {fmtDate(episode.air_date)}
              </span>
            )}
            {episode.runtime && (
              <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                {episode.runtime}m
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
