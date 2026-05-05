import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { getReviews } from "../review.api";
import { useAuth } from "../../auth/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  LogIn,
  ChevronDown,
  AlertCircle,
  Settings2,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { buildReviewTree } from "../utils/buildTree";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function ReviewSection({ mediaId }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const pickerRef = useRef(null);

  /* ── nested tree from flat array ── */
  const tree = useMemo(() => buildReviewTree(reviews), [reviews]);

  /* paginated slice of ROOT reviews only — replies live inside each item */
  const visibleTree = useMemo(
    () => tree.slice(0, page * pageSize),
    [tree, page, pageSize],
  );
  const hasMore = visibleTree.length < tree.length;
  const remaining = tree.length - visibleTree.length;

  /* close picker on outside click */
  useEffect(() => {
    if (!showSizePicker) return;
    const fn = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target))
        setShowSizePicker(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [showSizePicker]);

  /* ── fetch — keep mediaId as string, never Number() here ── */
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReviews(mediaId);
      setReviews(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [mediaId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await new Promise((r) => setTimeout(r, 280));
    setPage((p) => p + 1);
    setLoadingMore(false);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(1);
    setShowSizePicker(false);
  };

  /* ─────────────────── render ─────────────────── */
  return (
    <section style={{ marginTop: 8, marginBottom: 56 }}>
      {/* ── header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 3,
            height: 22,
            borderRadius: 99,
            background: "var(--color-gold)",
            flexShrink: 0,
          }}
        />
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--color-text-primary)",
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          Reviews
        </h2>

        {!loading && tree.length > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--color-gold)",
              background: "var(--color-gold-glow)",
              border: "1px solid var(--color-gold-border)",
              borderRadius: "var(--radius-full)",
              padding: "2px 9px",
              letterSpacing: "0.04em",
            }}
          >
            {tree.length}
          </motion.span>
        )}

        <div style={{ flex: 1 }} />

        {/* per-page picker */}
        {!loading && tree.length > 0 && (
          <div ref={pickerRef} style={{ position: "relative" }}>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => setShowSizePicker((s) => !s)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 11px",
                borderRadius: "var(--radius-full)",
                background: showSizePicker
                  ? "var(--color-bg-overlay)"
                  : "transparent",
                border: `1px solid ${showSizePicker ? "var(--color-gold-border)" : "var(--color-border)"}`,
                color: showSizePicker
                  ? "var(--color-gold)"
                  : "var(--color-text-muted)",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              <Settings2 style={{ width: 11, height: 11 }} />
              {pageSize} / page
            </motion.button>

            <AnimatePresence>
              {showSizePicker && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.14 }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    right: 0,
                    background: "var(--color-bg-overlay)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    zIndex: 50,
                    minWidth: 130,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--color-text-muted)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "8px 12px 4px",
                      margin: 0,
                    }}
                  >
                    Reviews / page
                  </p>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      onClick={() => handlePageSizeChange(size)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "8px 12px",
                        background:
                          size === pageSize
                            ? "var(--color-gold-glow)"
                            : "transparent",
                        border: "none",
                        color:
                          size === pageSize
                            ? "var(--color-gold)"
                            : "var(--color-text-secondary)",
                        fontSize: 13,
                        fontWeight: size === pageSize ? 700 : 400,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => {
                        if (size !== pageSize)
                          e.currentTarget.style.background =
                            "var(--color-bg-elevated)";
                      }}
                      onMouseLeave={(e) => {
                        if (size !== pageSize)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {size}
                      {size === pageSize && (
                        <Check style={{ width: 11, height: 11 }} />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── review form / sign-in gate ── */}
      <AnimatePresence mode="wait">
        {user ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ marginBottom: 28 }}
          >
            <ReviewForm
              mediaId={mediaId}
              onAdd={(r) => {
                setReviews((prev) => [r, ...prev]);
                setPage(1);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="signin"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 18px",
              borderRadius: "var(--radius-lg)",
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              marginBottom: 28,
            }}
          >
            <MessageSquare
              style={{
                width: 18,
                height: 18,
                color: "var(--color-gold-dim)",
                flexShrink: 0,
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "var(--color-text-muted)",
                flex: 1,
              }}
            >
              Sign in to leave a review
            </p>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate("/login")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 13px",
                borderRadius: "var(--radius-full)",
                background: "var(--color-gold-glow)",
                border: "1px solid var(--color-gold-border)",
                color: "var(--color-gold)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                flexShrink: 0,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(238,205,129,0.18)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--color-gold-glow)")
              }
            >
              <LogIn style={{ width: 12, height: 12 }} />
              Sign In
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── error ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "13px 16px",
              borderRadius: "var(--radius-md)",
              background: "rgba(220,38,38,0.08)",
              border: "1px solid rgba(220,38,38,0.22)",
              marginBottom: 20,
            }}
          >
            <AlertCircle
              style={{ width: 15, height: 15, color: "#f87171", flexShrink: 0 }}
            />
            <span style={{ fontSize: 13, color: "#fca5a5", flex: 1 }}>
              {error}
            </span>
            <button
              onClick={load}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#f87171",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── loading skeletons ── */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <ReviewSkeleton key={i} delay={i * 0.07} />
          ))}
        </div>
      )}

      {/* ── empty ── */}
      {!loading && !error && tree.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: "center",
            padding: "44px 24px",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-bg-elevated)",
            border: "1px dashed var(--color-border)",
          }}
        >
          <MessageSquare
            style={{
              width: 30,
              height: 30,
              color: "var(--color-text-muted)",
              margin: "0 auto 10px",
              opacity: 0.35,
            }}
          />
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-muted)",
              margin: "0 0 4px",
            }}
          >
            No reviews yet
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--color-text-muted)",
              margin: 0,
              opacity: 0.55,
            }}
          >
            Be the first to share your thoughts
          </p>
        </motion.div>
      )}

      {/* ── list ── */}
      {!loading && !error && tree.length > 0 && (
        <>
          {/* progress bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 2,
                background: "var(--color-border-subtle)",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((visibleTree.length / tree.length) * 100, 100)}%`,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: "var(--color-gold-dim)",
                  borderRadius: 99,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                color: "var(--color-text-muted)",
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {visibleTree.length} of {tree.length}
            </span>
          </div>

          <ReviewList reviews={visibleTree} setReviews={setReviews} />

          {/* load more */}
          {hasMore && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLoadMore}
                disabled={loadingMore}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 22px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-secondary)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: loadingMore ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  transition: "border-color 0.18s, color 0.18s",
                  opacity: loadingMore ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loadingMore) {
                    e.currentTarget.style.borderColor =
                      "var(--color-gold-border)";
                    e.currentTarget.style.color = "var(--color-gold)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                }}
              >
                {loadingMore ? (
                  <SpinnerIcon />
                ) : (
                  <ChevronDown style={{ width: 14, height: 14 }} />
                )}
                {loadingMore
                  ? "Loading…"
                  : `Load ${Math.min(pageSize, remaining)} more`}
              </motion.button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function SpinnerIcon() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      style={{ display: "flex" }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle
          cx="7"
          cy="7"
          r="5.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.25"
        />
        <path
          d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </motion.span>
  );
}

function ReviewSkeleton({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      style={{
        padding: "16px 18px",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <style>{`@keyframes skPulse{0%,100%{opacity:.3}50%{opacity:.6}} .skb{animation:skPulse 1.6s ease-in-out infinite;background:var(--color-bg-overlay);border-radius:6px;}`}</style>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div
          className="skb"
          style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div
            className="skb"
            style={{ width: 110, height: 12, marginBottom: 7 }}
          />
          <div className="skb" style={{ width: 70, height: 10 }} />
        </div>
        <div
          className="skb"
          style={{ width: 46, height: 20, borderRadius: 99 }}
        />
      </div>
      <div
        className="skb"
        style={{ width: "100%", height: 11, marginBottom: 7 }}
      />
      <div className="skb" style={{ width: "72%", height: 11 }} />
    </motion.div>
  );
}
