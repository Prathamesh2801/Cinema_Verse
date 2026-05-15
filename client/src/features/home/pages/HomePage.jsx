import { Suspense, lazy } from "react";
import { motion } from "framer-motion";

import Hero from "../../media/components/Hero";
import { useHomepageMedia } from "../../media/hooks/useHomepageMedia";

const MediaRow = lazy(() => import("../../media/components/MediaRow"));

// matches Tailwind max-w-7xl = 1280px — keep in sync with Hero.jsx
const CONTENT_MAX_W = 1280;

function HeroSkeleton() {
  return (
    <section
      style={{
        position: "relative",
        height: "clamp(420px, 58vh, 660px)",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ opacity: [0.26, 0.65, 0.26] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(155deg, #18181b 0%, #101012 40%, #09090b 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: CONTENT_MAX_W,
            margin: "0 auto",
            padding: "0 clamp(16px, 3.5vw, 40px)",
            paddingBottom: "clamp(28px, 4.5vh, 48px)",
          }}
        >
          <div
            style={{
              width: "clamp(180px, 24vw, 360px)",
              height: 32,
              borderRadius: "var(--radius-lg)",
              background: "var(--color-bg-elevated)",
              marginBottom: 16,
            }}
          />
          <div
            style={{
              width: "clamp(280px, 42vw, 520px)",
              height: 22,
              borderRadius: "var(--radius-lg)",
              background: "var(--color-bg-elevated)",
              marginBottom: 10,
            }}
          />
          <div
            style={{
              width: "clamp(140px, 20vw, 260px)",
              height: 14,
              borderRadius: "999px",
              background: "var(--color-bg-elevated)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

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

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { heroMedia, heroLoading, sections } = useHomepageMedia();

  const showHeroSkeleton = heroLoading || !heroMedia;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        background: "var(--color-bg)",
        minHeight: "100svh",
        overflowX: "hidden",
        paddingBottom: "clamp(56px, 9vh, 88px)",
      }}
    >
      {showHeroSkeleton ? <HeroSkeleton /> : <Hero media={heroMedia} />}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        style={{
          marginTop: "clamp(-36px, -4vh, -18px)",
          position: "relative",
          zIndex: 5,
          maxWidth: CONTENT_MAX_W,
          margin: "clamp(-6px, -4vh, -18px) auto 0",
          padding: "0 clamp(16px, 3.5vw, 40px)",
        }}
      >
        {sections.map((section, i) => (
          <div key={section.id} style={{ marginBottom: 24 }}>
            {section.items.length > 0 ? (
              <Suspense fallback={<SkeletonRow rowIndex={i} />}>
                <MediaRow title={section.title} data={section.items} />
              </Suspense>
            ) : (
              <SkeletonRow rowIndex={i} />
            )}
          </div>
        ))}
      </motion.div>
    </motion.main>
  );
}
