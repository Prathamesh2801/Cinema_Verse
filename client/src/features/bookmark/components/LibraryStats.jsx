import { motion } from "framer-motion";
import { Clapperboard, Clock, CalendarDays, Star } from "lucide-react";

import { computeStats } from "../utils/computeStats";

function StatTile({ icon: Icon, value, label }) {
  return (
    <div
      style={{
        flex: "1 1 120px",
        minWidth: 120,
        padding: "16px 18px",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border)",
      }}
    >
      <Icon style={{ width: 18, height: 18, color: "var(--color-gold)" }} />
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: "var(--color-text-primary)",
          margin: "8px 0 2px",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{label}</div>
    </div>
  );
}

export default function LibraryStats({ watchedItems }) {
  const stats = computeStats(watchedItems);

  if (stats.totalWatched === 0) return null;

  const maxGenre = Math.max(...stats.topGenres.map((g) => g.count), 1);
  const maxRating = Math.max(...stats.ratingDist.map((r) => r.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ marginBottom: 28 }}
    >
      {/* Stat tiles */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <StatTile icon={Clapperboard} value={stats.totalWatched} label="Titles watched" />
        <StatTile icon={Clock} value={`${stats.totalHours}h`} label="Hours watched" />
        <StatTile icon={CalendarDays} value={stats.thisYear} label="This year" />
        <StatTile
          icon={Star}
          value={stats.avgRating ? stats.avgRating.toFixed(1) : "—"}
          label="Avg rating"
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {/* Top genres */}
        {stats.topGenres.length > 0 && (
          <div style={{ flex: "1 1 260px", minWidth: 240 }}>
            <h3 style={sectionTitle}>Top genres</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {stats.topGenres.map((g) => (
                <div key={g.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 96,
                      fontSize: 12,
                      color: "var(--color-text-secondary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {g.name}
                  </span>
                  <div style={{ flex: 1, height: 8, background: "var(--color-bg-elevated)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(g.count / maxGenre) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      style={{ height: "100%", background: "var(--color-gold)", borderRadius: "var(--radius-full)" }}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: "var(--color-text-muted)", width: 18, textAlign: "right" }}>
                    {g.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating distribution */}
        <div style={{ flex: "1 1 220px", minWidth: 200 }}>
          <h3 style={sectionTitle}>Your ratings</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...stats.ratingDist].reverse().map((r) => (
              <div key={r.star} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, width: 44, fontSize: 12, color: "var(--color-text-secondary)" }}>
                  {r.star}
                  <Star style={{ width: 11, height: 11, fill: "var(--color-gold)", color: "var(--color-gold)" }} />
                </span>
                <div style={{ flex: 1, height: 8, background: "var(--color-bg-elevated)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.count / maxRating) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ height: "100%", background: "var(--color-royal-bright)", borderRadius: "var(--radius-full)" }}
                  />
                </div>
                <span style={{ fontSize: 11, color: "var(--color-text-muted)", width: 18, textAlign: "right" }}>
                  {r.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const sectionTitle = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--color-text-muted)",
  margin: "0 0 12px",
};
