import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaCard from "./MediaCard";

export default function RowSlider({ title, data = [] }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  if (!data.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: 40 }}
    >
      {/* Row header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          padding: "0 16px",
        }}
      >
        <h2
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--color-text-primary)",
            letterSpacing: "-0.2px",
            margin: 0,
          }}
        >
          {title}
        </h2>

        {/* Arrow buttons */}
        <div style={{ display: "flex", gap: 6 }}>
          {[{ dir: -1, icon: ChevronLeft }, { dir: 1, icon: ChevronRight }].map(({ dir, icon: Icon }) => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              style={{
                width: 30,
                height: 30,
                borderRadius: "var(--radius-full)",
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-gold-border)";
                e.currentTarget.style.background  = "var(--color-gold-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.background  = "var(--color-bg-elevated)";
              }}
            >
              <Icon className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="scrollbar-hide"
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          padding: "4px 16px 8px",
          scrollBehavior: "smooth",
        }}
      >
        {data.map((item, i) => (
          <MediaCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </motion.section>
  );
}