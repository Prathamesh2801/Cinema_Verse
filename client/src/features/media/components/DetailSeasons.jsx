import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layers, Star, ImageOff, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl, IMAGE_SIZES } from "../../../utils/image";

function fmtDate(str) {
  if (!str) return null;
  return new Date(str).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export default function DetailSeasons({ seasons = [] }) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    handleScroll();
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  if (!seasons.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      style={{ marginBottom: 32, position: "relative" }}
    >
      {/* Heading */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
          paddingRight: 60,
        }}
      >
        <Layers
          className="w-4 h-4"
          style={{ color: "var(--color-gold-dim)" }}
        />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "var(--color-text-muted)",
          }}
        >
          Seasons
        </span>
      </div>

      {/* Navigation arrows */}
      {showLeft && (
        <button
          onClick={() => scroll(-1)}
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 36,
            height: 36,
            borderRadius: "var(--radius-full)",
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-gold-border)";
            e.currentTarget.style.background = "var(--color-gold-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.background = "var(--color-bg-elevated)";
          }}
        >
          <ChevronLeft className="w-5 h-5" style={{ color: "var(--color-text-primary)" }} />
        </button>
      )}

      {showRight && (
        <button
          onClick={() => scroll(1)}
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 36,
            height: 36,
            borderRadius: "var(--radius-full)",
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-gold-border)";
            e.currentTarget.style.background = "var(--color-gold-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.background = "var(--color-bg-elevated)";
          }}
        >
          <ChevronRight className="w-5 h-5" style={{ color: "var(--color-text-primary)" }} />
        </button>
      )}

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="scrollbar-hide"
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          scrollBehavior: "smooth",
          padding: "4px 0 8px",
          marginLeft: -8,
          marginRight: -8,
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        {seasons.map((season, i) => (
          <motion.div
            key={season.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            style={{
              flexShrink: 0,
              width: "clamp(130px, 22vw, 160px)",
              borderRadius: "var(--radius-lg)",
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              overflow: "hidden",
              transition: "border-color 0.25s, box-shadow 0.25s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-gold-border)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px var(--color-gold-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Poster */}
            <div
              style={{
                width: "100%",
                aspectRatio: "2/3",
                background: "var(--color-bg-overlay)",
                position: "relative",
              }}
            >
              {season.poster_path ? (
                <img
                  src={getImageUrl(season.poster_path, IMAGE_SIZES.small)}
                  alt={season.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  loading="lazy"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ImageOff
                    className="w-8 h-8"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                </div>
              )}

              {/* Rating chip */}
              {season.vote_average > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 7,
                    right: 7,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    padding: "3px 6px",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(9,9,11,0.82)",
                    backdropFilter: "blur(6px)",
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
                    {season.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: "10px 10px 12px" }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  margin: "0 0 3px",
                  lineHeight: 1.2,
                }}
              >
                {season.name}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {season.episode_count > 0 && (
                  <span
                    style={{ fontSize: 10, color: "var(--color-text-muted)" }}
                  >
                    {season.episode_count} episodes
                  </span>
                )}
                {season.air_date && (
                  <span
                    style={{ fontSize: 10, color: "var(--color-text-muted)" }}
                  >
                    {fmtDate(season.air_date)}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
