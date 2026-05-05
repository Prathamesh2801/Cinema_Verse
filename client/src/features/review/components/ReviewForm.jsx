import { useState, useRef } from "react";
import { createReview } from "../review.api";
import { useAuth } from "../../auth/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Star, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ReviewForm({ mediaId, onAdd }) {
  const { token } = useAuth();

  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const effectiveRating = hoverRating || rating;
  const isValid = text.trim().length > 0 && rating > 0;

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const newReview = await createReview(
        {
          // ✅ Send mediaId exactly as received from useParams (string).
          // The backend/mongoose casts it. Never wrap in Number() here
          // because non-numeric TMDB IDs would become NaN.
          mediaId,
          review: text,
          rating,
        },
        token,
      );
      onAdd(newReview);
      setText("");
      setRating(0);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ?? "Failed to post review. Try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: "var(--radius-lg)",
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border)",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
      onFocusCapture={(e) =>
        (e.currentTarget.style.borderColor = "var(--color-gold-border)")
      }
      onBlurCapture={(e) =>
        (e.currentTarget.style.borderColor = "var(--color-border)")
      }
    >
      {/* textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Share your thoughts on this title…"
        rows={3}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          outline: "none",
          resize: "none",
          padding: "14px 16px 10px",
          fontSize: 13.5,
          lineHeight: 1.6,
          color: "var(--color-text-primary)",
          fontFamily: "inherit",
          caretColor: "var(--color-gold)",
        }}
      />

      {/* footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          borderTop: "1px solid var(--color-border-subtle)",
          flexWrap: "wrap",
        }}
      >
        {/* 10-star picker */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
            <motion.button
              key={val}
              whileTap={{ scale: 0.8 }}
              onClick={() => setRating(val)}
              onMouseEnter={() => setHoverRating(val)}
              onMouseLeave={() => setHoverRating(0)}
              title={`${val}/10`}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "1px",
                display: "flex",
              }}
            >
              <Star
                style={{
                  width: 13,
                  height: 13,
                  fill:
                    val <= effectiveRating
                      ? "var(--color-gold)"
                      : "transparent",
                  color:
                    val <= effectiveRating
                      ? "var(--color-gold)"
                      : "var(--color-text-muted)",
                  transition: "fill 0.1s, color 0.1s",
                }}
              />
            </motion.button>
          ))}

          <AnimatePresence mode="wait">
            {rating > 0 && (
              <motion.span
                key={rating}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--color-gold)",
                  marginLeft: 6,
                  minWidth: 32,
                }}
              >
                {rating}/10
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div style={{ flex: 1 }} />

        <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
          ⌘ Enter
        </span>

        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 15px",
            borderRadius: "var(--radius-full)",
            background: isValid ? "var(--color-gold-glow)" : "transparent",
            border: `1px solid ${isValid ? "var(--color-gold-border)" : "var(--color-border-subtle)"}`,
            color: isValid ? "var(--color-gold)" : "var(--color-text-muted)",
            fontSize: 12,
            fontWeight: 700,
            cursor: isValid && !submitting ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            transition: "all 0.18s",
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? (
            <SpinnerIcon />
          ) : success ? (
            <CheckCircle2 style={{ width: 13, height: 13 }} />
          ) : (
            <Send style={{ width: 12, height: 12 }} />
          )}
          {submitting ? "Posting…" : success ? "Posted!" : "Post Review"}
        </motion.button>
      </div>

      {/* error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderTop: "1px solid rgba(220,38,38,0.2)",
              background: "rgba(220,38,38,0.06)",
            }}
          >
            <AlertCircle style={{ width: 13, height: 13, color: "#f87171" }} />
            <span style={{ fontSize: 12, color: "#fca5a5" }}>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SpinnerIcon() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      style={{ display: "flex" }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <circle
          cx="6.5"
          cy="6.5"
          r="5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.25"
        />
        <path
          d="M6.5 1.5A5 5 0 0 1 11.5 6.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </motion.span>
  );
}
