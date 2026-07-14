import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Library,
  Bookmark,
  Play,
  Check,
  Film,
  Tv,
  LogIn,
  SlidersHorizontal,
} from "lucide-react";

import { useLibrary } from "../context/BookmarkContext";
import { useAuth } from "../../auth/context/AuthContext";
import { getMovieDetails } from "../../movies/movie.api";
import { getTVDetails } from "../../tv/tv.api";
import MediaCard from "../../media/components/MediaCard";
import LibraryStats from "../components/LibraryStats";

const STATUS_TABS = [
  { value: "want", label: "Watchlist", icon: Bookmark },
  { value: "watching", label: "Watching", icon: Play },
  { value: "watched", label: "Watched", icon: Check },
];

const MEDIA_FILTERS = ["All", "Movies", "TV Shows"];

const GRID_STYLE = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(clamp(104px, 30vw, 150px), 1fr))",
  gap: "clamp(10px, 2vw, 18px)",
};

/* ── Skeleton ── */
function SkeletonGrid({ count = 12 }) {
  return (
    <div style={GRID_STYLE}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.28, 0.55, 0.28] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.04 }}
          style={{
            width: "100%",
            aspectRatio: "2/3",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-bg-elevated)",
          }}
        />
      ))}
    </div>
  );
}

/* ── Auth gate ── */
function AuthGate() {
  const navigate = useNavigate();
  return (
    <div style={centeredState}>
      <div style={iconBadge}>🔐</div>
      <div style={{ maxWidth: 300 }}>
        <p style={stateTitle}>Sign in to view your library</p>
        <p style={stateSub}>
          Track what you want to watch, are watching, and have watched — across all your devices.
        </p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/login")} style={primaryBtn}>
          <LogIn style={{ width: 14, height: 14 }} /> Sign In
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/register")} style={ghostBtn}>
          Create Account
        </motion.button>
      </div>
    </div>
  );
}

/* ── Error ── */
function ErrorState({ onRetry }) {
  return (
    <div style={centeredState}>
      <span style={{ fontSize: 32 }}>⚠️</span>
      <p style={stateSub}>Couldn't load your library.</p>
      <motion.button whileTap={{ scale: 0.95 }} onClick={onRetry} style={goldPill}>
        Try Again
      </motion.button>
    </div>
  );
}

/* ── Main ── */
export default function BookmarkPage() {
  const { entries } = useLibrary();
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusTab, setStatusTab] = useState("want");
  const [mediaFilter, setMediaFilter] = useState("All");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!user) return;
    let active = true;

    async function hydrate() {
      setLoading(true);
      setError(false);
      try {
        const hydrated = await Promise.all(
          entries.map(async (entry) => {
            const detail =
              entry.mediaType === "tv"
                ? await getTVDetails(entry.mediaId)
                : await getMovieDetails(entry.mediaId);
            return {
              ...detail,
              media_type: entry.mediaType,
              status: entry.status,
              userRating: entry.rating,
              note: entry.note,
              watchedAt: entry.watchedAt,
            };
          }),
        );
        if (active) setItems(hydrated);
      } catch (err) {
        console.error("Library hydration error:", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    hydrate();
    return () => {
      active = false;
    };
  }, [entries, user, retryKey]);

  if (!user) return <AuthGate />;
  if (error) return <ErrorState onRetry={() => setRetryKey((k) => k + 1)} />;

  const countFor = (status) => items.filter((i) => i.status === status).length;

  const byStatus = items.filter((i) => i.status === statusTab);
  const watchedItems = items.filter((i) => i.status === "watched");

  const visible = byStatus.filter((i) => {
    if (mediaFilter === "Movies") return i.media_type === "movie";
    if (mediaFilter === "TV Shows") return i.media_type === "tv";
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{ paddingBottom: 90, maxWidth: 1280, margin: "0 auto" }}
    >
      {/* Header */}
      <div style={{ padding: "28px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={headerIcon}>
            <Library style={{ width: 16, height: 16, color: "var(--color-gold)" }} />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text-primary)", margin: 0, letterSpacing: "-0.03em" }}>
            My Library
          </h1>
        </div>

        {/* Status tabs */}
        <div className="scrollbar-hide" style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {STATUS_TABS.map(({ value, label, icon: Icon }) => {
            const active = statusTab === value;
            return (
              <button
                key={value}
                onClick={() => setStatusTab(value)}
                style={{
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  background: active ? "var(--color-gold)" : "var(--color-bg-elevated)",
                  border: `1px solid ${active ? "var(--color-gold)" : "var(--color-border)"}`,
                  color: active ? "var(--color-bg)" : "var(--color-text-secondary)",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <Icon style={{ width: 13, height: 13 }} />
                {label}
                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.7 }}>{countFor(value)}</span>
              </button>
            );
          })}
        </div>

        {/* Media sub-filter */}
        {!loading && byStatus.length > 0 && (
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            {MEDIA_FILTERS.map((f) => {
              const active = mediaFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setMediaFilter(f)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 12px",
                    borderRadius: "var(--radius-full)",
                    border: `1px solid ${active ? "var(--color-gold-border)" : "var(--color-border)"}`,
                    background: active ? "var(--color-gold-glow)" : "transparent",
                    color: active ? "var(--color-gold)" : "var(--color-text-muted)",
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {f === "Movies" && <Film style={{ width: 11, height: 11 }} />}
                  {f === "TV Shows" && <Tv style={{ width: 11, height: 11 }} />}
                  {f === "All" && <SlidersHorizontal style={{ width: 11, height: 11 }} />}
                  {f}
                </button>
              );
            })}
          </div>
        )}

        <div style={{ borderTop: "1px solid var(--color-border-subtle)", marginTop: 16 }} />
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 0" }}>
        {loading ? (
          <SkeletonGrid count={Math.min(entries.length || 8, 18)} />
        ) : (
          <>
            {statusTab === "watched" && <LibraryStats watchedItems={watchedItems} />}

            {visible.length === 0 ? (
              <EmptyState statusTab={statusTab} hasAny={items.length > 0} />
            ) : (
              <motion.div layout style={GRID_STYLE}>
                <AnimatePresence mode="popLayout">
                  {visible.map((item, i) => (
                    <MediaCard
                      key={`${item.media_type}-${item.id}`}
                      item={item}
                      index={i % 12}
                      fluid
                      showRemove
                      statusBadge={item.status}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ── Empty state per tab ── */
function EmptyState({ statusTab, hasAny }) {
  const navigate = useNavigate();
  const copy = {
    want: { title: "Your watchlist is empty", sub: "Add titles you want to watch from any movie or show page." },
    watching: { title: "Nothing in progress", sub: "Mark something as “Watching” to see it here." },
    watched: { title: "No watched titles yet", sub: "Mark titles as “Watched” to build your catalogue and stats." },
  }[statusTab];

  return (
    <div style={centeredState}>
      <div style={iconBadge}>
        <Library style={{ width: 28, height: 28, color: "var(--color-gold)", strokeWidth: 1.5 }} />
      </div>
      <div style={{ maxWidth: 300 }}>
        <p style={stateTitle}>{copy.title}</p>
        <p style={stateSub}>{copy.sub}</p>
      </div>
      {!hasAny && (
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/")} style={goldPill}>
          Browse Content
        </motion.button>
      )}
    </div>
  );
}

/* ── shared styles ── */
const centeredState = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "45vh",
  gap: 18,
  padding: "40px 24px",
  textAlign: "center",
};
const iconBadge = {
  width: 72,
  height: 72,
  borderRadius: "var(--radius-xl)",
  background: "var(--color-bg-elevated)",
  border: "1px solid var(--color-border)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 0 40px var(--color-gold-glow)",
  fontSize: 32,
};
const headerIcon = {
  width: 34,
  height: 34,
  borderRadius: "var(--radius-md)",
  background: "var(--color-gold-glow)",
  border: "1px solid var(--color-gold-border)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const stateTitle = {
  fontSize: 18,
  fontWeight: 700,
  color: "var(--color-text-primary)",
  marginBottom: 8,
  letterSpacing: "-0.02em",
};
const stateSub = { fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.6, margin: 0 };
const goldPill = {
  padding: "10px 22px",
  borderRadius: "var(--radius-full)",
  background: "var(--color-gold-glow)",
  border: "1px solid var(--color-gold-border)",
  color: "var(--color-gold)",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
};
const primaryBtn = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  padding: "10px 22px",
  borderRadius: "var(--radius-full)",
  background: "var(--color-gold)",
  border: "none",
  color: "var(--color-bg)",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
};
const ghostBtn = {
  padding: "10px 22px",
  borderRadius: "var(--radius-full)",
  background: "transparent",
  border: "1px solid var(--color-border)",
  color: "var(--color-text-secondary)",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};
