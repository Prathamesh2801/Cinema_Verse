import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "relative",
        padding: "32px 16px 20px",
        overflow: "hidden",
      }}
    >
      {/* Ambient gold glow top-right */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 280,
          height: 280,
          borderRadius: "var(--radius-full)",
          background: "var(--color-gold-glow)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      {/* Ambient royal glow bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: -40,
          width: 200,
          height: 200,
          borderRadius: "var(--radius-full)",
          background: "var(--color-royal-dim)",
          filter: "blur(50px)",
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />

      <div style={{ position: "relative", maxWidth: "100%" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--color-gold-dim)",
              marginBottom: 8,
            }}
          >
            Trending Now
          </p>
          <h1
            style={{
              fontSize: "clamp(22px, 6vw, 36px)",
              fontWeight: 800,
              color: "var(--color-text-primary)",
              lineHeight: 1.15,
              letterSpacing: "-0.5px",
              marginBottom: 8,
            }}
          >
            Discover What's{" "}
            <span style={{ color: "var(--color-gold)" }}>Popular</span>
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--color-text-muted)",
              maxWidth: 380,
              lineHeight: 1.55,
            }}
          >
            Trending movies and shows — updated daily with the latest releases.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
