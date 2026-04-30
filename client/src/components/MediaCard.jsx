import { motion } from "framer-motion";
import { Star, ImageOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MediaCard({ item, index = 0 }) {
  const navigate = useNavigate();
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average?.toFixed(1);
  const hasPoster = !!item.poster_path;
  const isTV = item.media_type === "tv";

  return (
    <motion.div
      onClick={() => navigate(`/${item.media_type}/${item.id}`)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative flex-shrink-0 cursor-pointer"
      style={{ minWidth: 130, width: 130 }}
    >
      {/* Poster */}
      <div
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
        {hasPoster ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
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

        {/* Bottom gradient on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(to top, rgba(9,9,11,0.85) 0%, transparent 55%)",
          }}
        />

        {/* Star rating badge */}
        {rating && (
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

      {/* Title + year */}
      <div style={{ marginTop: 7, paddingLeft: 2 }}>
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
    </motion.div>
  );
}
