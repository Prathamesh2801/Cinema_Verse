import { motion } from "framer-motion";
import { Clock, Tv2, CheckCircle2, DollarSign, TrendingUp, Film } from "lucide-react";

function fmtMoney(n) {
  if (!n || n === 0) return null;
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

function fmtRuntime(mins) {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function Pill({ icon: Icon, label, value, accent = false }) {
  if (!value) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "12px 16px",
        borderRadius: "var(--radius-lg)",
        background: accent ? "var(--color-gold-glow)" : "var(--color-bg-elevated)",
        border: `1px solid ${accent ? "var(--color-gold-border)" : "var(--color-border)"}`,
        minWidth: 100,
        flex: "1 1 100px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <Icon
          className="w-3.5 h-3.5"
          style={{ color: accent ? "var(--color-gold-dim)" : "var(--color-text-muted)", flexShrink: 0 }}
        />
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: accent ? "var(--color-gold-dim)" : "var(--color-text-muted)",
          }}
        >
          {label}
        </span>
      </div>
      <span
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: accent ? "var(--color-gold)" : "var(--color-text-primary)",
          lineHeight: 1.2,
        }}
      >
        {value}
      </span>
    </motion.div>
  );
}

export default function DetailMeta({ data, type }) {
  const isTV = type === "tv";

  const statusColor =
    data.status === "Released" || data.status === "Returning Series"
      ? "var(--color-royal-bright)"
      : data.status === "Ended" || data.status === "Canceled"
      ? "var(--color-text-muted)"
      : "var(--color-text-secondary)";

  return (
    <section style={{ marginBottom: 32 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {/* Movie: runtime, budget, revenue */}
        {!isTV && (
          <>
            <Pill icon={Clock}       label="Runtime"  value={fmtRuntime(data.runtime)} />
            <Pill icon={DollarSign}  label="Budget"   value={fmtMoney(data.budget)} />
            <Pill icon={TrendingUp}  label="Revenue"  value={fmtMoney(data.revenue)} accent />
          </>
        )}

        {/* TV: episodes, seasons */}
        {isTV && (
          <>
            <Pill icon={Tv2}  label="Seasons"  value={data.number_of_seasons ? `${data.number_of_seasons}` : null} />
            <Pill icon={Film} label="Episodes" value={data.number_of_episodes ? `${data.number_of_episodes}` : null} />
          </>
        )}

        {/* Shared: status, vote count */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: "12px 16px",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            minWidth: 100,
            flex: "1 1 100px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--color-text-muted)" }} />
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-text-muted)" }}>
              Status
            </span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: statusColor, lineHeight: 1.2 }}>
            {data.status || "—"}
          </span>
        </div>

        {data.vote_count > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: "12px 16px",
              borderRadius: "var(--radius-lg)",
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              minWidth: 100,
              flex: "1 1 100px",
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-text-muted)" }}>
              Votes
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1.2 }}>
              {data.vote_count.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
