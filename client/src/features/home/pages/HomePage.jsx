import { motion } from "framer-motion";

import Hero from "../../media/components/Hero";
import MediaRow from "../../media/components/MediaRow";
import { useHomepageMedia } from "../../media/hooks/useHomepageMedia";

// matches Tailwind max-w-7xl = 1280px — keep in sync with Hero.jsx
const CONTENT_MAX_W = 1280;

// ─── Skeleton shimmer card ───────────────────────────────────────────────────
function SkeletonCard({ delay = 0 }) {
  return (
    <motion.div
      animate={{ opacity: [0.28, 0.58, 0.28] }}
      transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut", delay }}
      style={{
        width: "clamp(90px, 22vw, 130px)",
        aspectRatio: "2/3",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-bg-elevated)",
        flexShrink: 0,
      }}
    />
  );
}

// ─── Skeleton row ────────────────────────────────────────────────────────────
function SkeletonRow({ rowIndex }) {
  return (
    <div style={{ marginBottom: "clamp(28px, 4vw, 44px)" }}>
      {/* Row title bar */}
      <motion.div
        animate={{ opacity: [0.28, 0.55, 0.28] }}
        transition={{
          duration: 1.7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: rowIndex * 0.18,
        }}
        style={{
          width: "clamp(110px, 18vw, 180px)",
          height: 14,
          borderRadius: 6,
          marginBottom: 14,
          background: "var(--color-bg-elevated)",
        }}
      />
      {/* Cards strip */}
      <div
        style={{
          display: "flex",
          gap: "clamp(8px, 1.5vw, 12px)",
          overflow: "hidden",
        }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 0.06 + rowIndex * 0.1} />
        ))}
      </div>
    </div>
  );
}

// ─── Loading state ────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div
      style={{
        minHeight: "100svh",
        background: "var(--color-bg)",
        overflowX: "hidden",
      }}
    >
      {/* Hero skeleton */}
      <motion.div
        animate={{ opacity: [0.32, 0.55, 0.32] }}
        transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        style={{
          height: "clamp(420px, 58vh, 660px)",
          background:
            "linear-gradient(155deg, #18181b 0%, #101012 55%, #09090b 100%)",
        }}
      />

      {/* Row skeletons — constrained to max-w-7xl */}
      <div
        style={{
          maxWidth: CONTENT_MAX_W,
          margin: "0 auto",
          padding: "clamp(24px, 3.5vw, 36px) clamp(16px, 3.5vw, 40px) 0",
        }}
      >
        {[0, 1, 2].map((i) => (
          <SkeletonRow key={i} rowIndex={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { sections, featuredMedia, loading } = useHomepageMedia();

  if (loading) return <LoadingState />;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        background: "var(--color-bg)",
        minHeight: "100svh",
        overflowX: "hidden",
        paddingBottom: "clamp(56px, 9vh, 88px)",
      }}
    >
      {/* ── HERO — full-bleed, image goes edge to edge ─────────── */}
      <Hero media={featuredMedia} />

      {/* ── DISCOVERY ROWS — constrained to max-w-7xl ──────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        style={{
          // Slight overlap so rows feel connected to the hero bottom fade
          marginTop: "clamp(-36px, -4vh, -18px)",
          position: "relative",
          zIndex: 5,
          maxWidth: CONTENT_MAX_W,
          margin: "clamp(-36px, -4vh, -18px) auto 0",
          padding: "0 clamp(16px, 3.5vw, 40px)",
        }}
      >
        {sections.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.24 + i * 0.07,
            }}
          >
            <MediaRow title={section.title} data={section.items} />
          </motion.div>
        ))}
      </motion.div>
    </motion.main>
  );
}