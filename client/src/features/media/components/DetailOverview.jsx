import { motion } from "framer-motion";
import { AlignLeft } from "lucide-react";

export default function DetailOverview({ data }) {
  const languages = data.spoken_languages ?? [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      style={{ marginBottom: 32 }}
    >
      {/* Section heading */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <AlignLeft className="w-4 h-4" style={{ color: "var(--color-gold-dim)" }} />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "var(--color-text-muted)",
          }}
        >
          Overview
        </span>
      </div>

      {/* Overview body */}
      <p
        style={{
          fontSize: "clamp(13px, 1.5vw, 15px)",
          color: "var(--color-text-secondary)",
          lineHeight: 1.75,
          maxWidth: 760,
        }}
      >
        {data.overview}
      </p>

      {/* Spoken languages */}
      {languages.length > 0 && (
        <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--color-text-muted)",
              marginRight: 4,
            }}
          >
            Languages:
          </span>
          {languages.map((lang) => (
            <span
              key={lang.iso_639_1}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 9px",
                borderRadius: "var(--radius-full)",
                background: "var(--color-royal-dim)",
                border: "1px solid var(--color-royal-border)",
                color: "var(--color-text-royal)",
              }}
            >
              {lang.english_name}
            </span>
          ))}
        </div>
      )}
    </motion.section>
  );
}
