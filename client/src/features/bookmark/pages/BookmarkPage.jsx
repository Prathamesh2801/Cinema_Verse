import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, LogIn, Film, Tv, SlidersHorizontal } from "lucide-react";

import { useBookmarks } from "../context/BookmarkContext";
import { useAuth } from "../../auth/context/AuthContext"; // adjust to your auth context path
import { getMovieDetails } from "../../movies/movie.api";
import { getTVDetails } from "../../tv/tv.api";

import MediaCard from "../../media/components/MediaCard";

/* ── Skeleton card ── */
function SkeletonCard({ index }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      style={{ minWidth: 130, width: 130 }}
    >
      <div
        className="shimmer-card"
        style={{
          aspectRatio: "2/3",
          borderRadius: "var(--radius-lg)",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
        }}
      />
      <div style={{ marginTop: 8, paddingLeft: 2 }}>
        <div
          className="shimmer-card"
          style={{
            height: 10,
            width: "80%",
            borderRadius: 4,
            background: "var(--color-bg-elevated)",
            marginBottom: 5,
          }}
        />
        <div
          className="shimmer-card"
          style={{
            height: 8,
            width: "40%",
            borderRadius: 4,
            background: "var(--color-bg-elevated)",
          }}
        />
      </div>
    </motion.div>
  );
}

/* ── Empty state ── */
function EmptyBookmarks() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "55vh",
        gap: 20,
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      {/* Decorative bookmark icon with glow */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "var(--radius-xl)",
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 40px var(--color-gold-glow)",
          }}
        >
          <Bookmark
            style={{
              width: 32,
              height: 32,
              color: "var(--color-gold)",
              strokeWidth: 1.5,
            }}
          />
        </div>
        {/* Subtle orbit dots */}
        {[0, 120, 240].map((deg, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 90 + i * 12,
              height: 90 + i * 12,
              marginTop: -(45 + i * 6),
              marginLeft: -(45 + i * 6),
              borderRadius: "50%",
              border: `1px dashed rgba(238,205,129,${0.08 - i * 0.02})`,
              pointerEvents: "none",
            }}
          />
        ))}
      </div>

      <div style={{ maxWidth: 280 }}>
        <p
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--color-text-primary)",
            marginBottom: 8,
            letterSpacing: "-0.02em",
          }}
        >
          Nothing saved yet
        </p>
        <p
          style={{
            fontSize: 13,
            color: "var(--color-text-muted)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Tap the{" "}
          <Bookmark
            style={{
              width: 12,
              height: 12,
              display: "inline",
              verticalAlign: "middle",
              color: "var(--color-gold)",
            }}
          />{" "}
          on any movie or show to save it here for later.
        </p>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => navigate("/")}
        style={{
          marginTop: 4,
          padding: "10px 22px",
          borderRadius: "var(--radius-full)",
          background: "var(--color-gold-glow)",
          border: "1px solid var(--color-gold-border)",
          color: "var(--color-gold)",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          letterSpacing: "0.02em",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(238,205,129,0.18)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--color-gold-glow)")
        }
      >
        Browse Content
      </motion.button>
    </motion.div>
  );
}

/* ── Auth gate — shown when user is not signed in ── */
function AuthGate() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "55vh",
        gap: 20,
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
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
        }}
      >
        🔐
      </div>

      <div style={{ maxWidth: 280 }}>
        <p
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--color-text-primary)",
            marginBottom: 8,
            letterSpacing: "-0.02em",
          }}
        >
          Sign in to view bookmarks
        </p>
        <p
          style={{
            fontSize: 13,
            color: "var(--color-text-muted)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Create an account or sign in to save movies and shows across all your
          devices.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 22px",
            borderRadius: "var(--radius-full)",
            background: "var(--color-gold)",
            border: "none",
            color: "var(--color-bg)",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 7,
            letterSpacing: "0.01em",
          }}
        >
          <LogIn style={{ width: 14, height: 14 }} />
          Sign In
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/register")}
          style={{
            padding: "10px 22px",
            borderRadius: "var(--radius-full)",
            background: "transparent",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-secondary)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: "0.01em",
          }}
        >
          Create Account
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── Filter tabs ── */
const FILTERS = ["All", "Movies", "TV Shows"];

/* ── Error state ── */
function ErrorState({ onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "40vh",
        gap: 14,
        padding: 24,
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: 32 }}>⚠️</span>
      <p style={{ fontSize: 14, color: "var(--color-text-muted)", margin: 0 }}>
        Couldn't load your bookmarks.
      </p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        style={{
          padding: "8px 18px",
          borderRadius: "var(--radius-full)",
          background: "var(--color-gold-glow)",
          border: "1px solid var(--color-gold-border)",
          color: "var(--color-gold)",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Try Again
      </motion.button>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function BookmarkPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("All");
  const [retryKey, setRetryKey] = useState(0);

  const { bookmarks } = useBookmarks();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function hydrate() {
      setLoading(true);
      setError(false);

      try {
        const hydrated = await Promise.all(
          bookmarks.map(async (item) => {
            if (item.mediaType === "tv") {
              const data = await getTVDetails(item.mediaId);
              return { ...data, media_type: "tv" };
            } else {
              const data = await getMovieDetails(item.mediaId);
              return { ...data, media_type: "movie" };
            }
          }),
        );
        setItems(hydrated);
      } catch (err) {
        console.error("Hydration error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    hydrate();
  }, [bookmarks, user, retryKey]);

  /* ── Not authenticated ── */
  if (!user) return <AuthGate />;

  /* ── Error ── */
  if (error) return <ErrorState onRetry={() => setRetryKey((k) => k + 1)} />;

  /* ── Filtered items ── */
  const filtered = items.filter((item) => {
    if (filter === "Movies") return item.media_type === "movie";
    if (filter === "TV Shows") return item.media_type === "tv";
    return true;
  });

  const movieCount = items.filter((i) => i.media_type === "movie").length;
  const tvCount = items.filter((i) => i.media_type === "tv").length;

  return (
    <>
      <style>{`
        @keyframes card-shimmer {
          0%   { background-position: -300px 0; }
          100% { background-position: 300px 0; }
        }
        .shimmer-card {
          background: linear-gradient(
            90deg,
            var(--color-bg-elevated) 25%,
            rgba(238,205,129,0.05) 50%,
            var(--color-bg-elevated) 75%
          );
          background-size: 600px 100%;
          animation: card-shimmer 1.6s ease-in-out infinite;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        style={{ paddingBottom: 80 }}
      >
        {/* ── Header ── */}
        <div
          style={{
            padding: "28px 20px 0",
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          {/* Title row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "var(--radius-md)",
                background: "var(--color-gold-glow)",
                border: "1px solid var(--color-gold-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bookmark
                style={{
                  width: 16,
                  height: 16,
                  color: "var(--color-gold)",
                  strokeWidth: 2,
                }}
              />
            </div>
            <div>
              <h1
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "var(--color-text-primary)",
                  margin: 0,
                  letterSpacing: "-0.03em",
                }}
              >
                My Bookmarks
              </h1>
              {!loading && (
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-muted)",
                    margin: 0,
                    marginTop: 1,
                  }}
                >
                  {items.length} saved
                  {movieCount > 0 &&
                    ` · ${movieCount} film${movieCount !== 1 ? "s" : ""}`}
                  {tvCount > 0 &&
                    ` · ${tvCount} show${tvCount !== 1 ? "s" : ""}`}
                </p>
              )}
            </div>
          </div>

          {/* Filter tabs — only show when we have content */}
          {!loading && items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                display: "flex",
                gap: 6,
                marginTop: 18,
                marginBottom: 4,
              }}
            >
              {FILTERS.map((f) => {
                const isActive = filter === f;
                const count =
                  f === "Movies"
                    ? movieCount
                    : f === "TV Shows"
                      ? tvCount
                      : items.length;

                return (
                  <motion.button
                    key={f}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "var(--radius-full)",
                      border: `1px solid ${isActive ? "var(--color-gold-border)" : "var(--color-border)"}`,
                      background: isActive
                        ? "var(--color-gold-glow)"
                        : "transparent",
                      color: isActive
                        ? "var(--color-gold)"
                        : "var(--color-text-muted)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      transition: "all 0.2s",
                    }}
                  >
                    {f === "Movies" && (
                      <Film style={{ width: 11, height: 11 }} />
                    )}
                    {f === "TV Shows" && (
                      <Tv style={{ width: 11, height: 11 }} />
                    )}
                    {f === "All" && (
                      <SlidersHorizontal style={{ width: 11, height: 11 }} />
                    )}
                    {f}
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: isActive
                          ? "var(--color-gold)"
                          : "var(--color-text-muted)",
                        background: isActive
                          ? "rgba(238,205,129,0.15)"
                          : "rgba(255,255,255,0.05)",
                        padding: "1px 5px",
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* Divider */}
          <div
            style={{
              borderTop: "1px solid var(--color-border-subtle)",
              marginTop: 16,
            }}
          />
        </div>

        {/* ── Content ── */}
        <div
          style={{ padding: "20px 20px 0", maxWidth: 1280, margin: "0 auto" }}
        >
          {loading ? (
            /* Skeleton grid */
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, 130px)",
                gap: 16,
              }}
            >
              {Array.from({ length: Math.min(bookmarks.length || 8, 18) }).map(
                (_, i) => (
                  <SkeletonCard key={i} index={i} />
                ),
              )}
            </div>
          ) : items.length === 0 ? (
            <EmptyBookmarks />
          ) : filtered.length === 0 ? (
            /* Empty filtered state */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "30vh",
                gap: 12,
                textAlign: "center",
              }}
            >
              {filter === "Movies" ? (
                <Film
                  style={{
                    width: 32,
                    height: 32,
                    color: "var(--color-text-muted)",
                  }}
                />
              ) : (
                <Tv
                  style={{
                    width: 32,
                    height: 32,
                    color: "var(--color-text-muted)",
                  }}
                />
              )}
              <p
                style={{
                  fontSize: 14,
                  color: "var(--color-text-muted)",
                  margin: 0,
                }}
              >
                No {filter.toLowerCase()} saved yet.
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter("All")}
                style={{
                  padding: "6px 16px",
                  borderRadius: "var(--radius-full)",
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-muted)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Show all
              </motion.button>
            </motion.div>
          ) : (
            /* Card grid */
            <motion.div
              layout
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, 130px)",
                gap: 16,
              }}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <MediaCard
                    key={`${item.media_type}-${item.id}`}
                    item={item}
                    index={i}
                    showRemove
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
