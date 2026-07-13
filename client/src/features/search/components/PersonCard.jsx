import { motion } from "framer-motion";
import { User } from "lucide-react";

import { getImageUrl, IMAGE_SIZES } from "../../../utils/image";

/**
 * PersonCard — a search result for a famous person.
 * Same 2:3 footprint as MediaCard so the mixed grid stays aligned; distinguished
 * by a "Person" badge and a "known for" subtitle. Not navigable (no person page).
 */
export default function PersonCard({ person, index = 0 }) {
  const hasPhoto = !!person.profile_path;

  const knownFor = (person.known_for || [])
    .map((k) => k.title || k.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.32,
        delay: index * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      className="group relative"
      style={{ width: "100%" }}
    >
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
        {hasPhoto ? (
          <img
            src={getImageUrl(person.profile_path, IMAGE_SIZES.small)}
            alt={person.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User
              className="w-8 h-8"
              style={{ color: "var(--color-text-muted)" }}
            />
          </div>
        )}

        {/* Person badge */}
        <div
          className="absolute top-2 left-2 flex items-center gap-1"
          style={{
            background: "rgba(9,9,11,0.80)",
            backdropFilter: "blur(6px)",
            borderRadius: "var(--radius-sm)",
            padding: "2px 7px",
            border: "1px solid var(--color-royal-border)",
          }}
        >
          <User
            style={{ width: 9, height: 9, color: "var(--color-text-royal)" }}
          />
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--color-text-royal)",
            }}
          >
            Person
          </span>
        </div>
      </div>

      {/* Name + known-for */}
      <div style={{ marginTop: 7, paddingLeft: 2 }}>
        <p
          className="line-clamp-1"
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--color-text-secondary)",
            margin: 0,
          }}
        >
          {person.name}
        </p>
        {knownFor && (
          <p
            className="line-clamp-1"
            style={{
              fontSize: 10,
              color: "var(--color-text-muted)",
              marginTop: 2,
            }}
          >
            {knownFor}
          </p>
        )}
      </div>
    </motion.div>
  );
}
