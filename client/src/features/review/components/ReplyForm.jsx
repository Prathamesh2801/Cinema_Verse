import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, AlertCircle } from "lucide-react";
import { createReply } from "../review.api";
import { useAuth } from "../../auth/context/AuthContext";
import { addReplyToList } from "../utils/reviewHelpers";

export default function ReplyForm({ parentId, setReviews, onDone }) {
  const { token, user } = useAuth();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  /* auto-focus when form appears */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleReply = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const newReply = await createReply(
        { parentId, review: text }, // ✅ no mediaId — backend derives from parent
        token,
      );
      setReviews((prev) => addReplyToList(prev, newReply));
      setText("");
      onDone?.();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message ?? "Failed to post reply.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
    if (e.key === "Escape") onDone?.();
  };

  const initial = (user?.username || "?")[0].toUpperCase();

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {/* mini avatar */}
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "var(--color-royal-dim)",
            border: "1.5px solid var(--color-royal-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 700,
            color: "var(--color-text-royal)",
            flexShrink: 0,
          }}
        >
          {initial}
        </div>

        {/* pill input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flex: 1,
            background: "var(--color-bg-overlay)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-full)",
            padding: "5px 6px 5px 13px",
            transition: "border-color 0.18s",
          }}
          onFocusCapture={(e) =>
            (e.currentTarget.style.borderColor = "var(--color-royal-border)")
          }
          onBlurCapture={(e) =>
            (e.currentTarget.style.borderColor = "var(--color-border)")
          }
        >
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a reply… (Enter to send, Esc to cancel)"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 12.5,
              color: "var(--color-text-primary)",
              fontFamily: "inherit",
              caretColor: "var(--color-text-royal)",
              minWidth: 0,
            }}
          />

          <AnimatePresence>
            {text.trim() && (
              <motion.button
                initial={{ opacity: 0, scale: 0.65 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.65 }}
                whileTap={{ scale: 0.85 }}
                onClick={handleReply}
                disabled={submitting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 27,
                  height: 27,
                  borderRadius: "50%",
                  background: "var(--color-royal-dim)",
                  border: "1px solid var(--color-royal-border)",
                  color: "var(--color-text-royal)",
                  cursor: submitting ? "not-allowed" : "pointer",
                  flexShrink: 0,
                  opacity: submitting ? 0.6 : 1,
                  transition: "background 0.14s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(43,76,140,0.48)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--color-royal-dim)")
                }
              >
                {submitting ? (
                  <SpinnerIcon />
                ) : (
                  <Send style={{ width: 11, height: 11 }} />
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
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
              gap: 6,
              marginTop: 6,
              paddingLeft: 34,
              fontSize: 11.5,
              color: "#fca5a5",
            }}
          >
            <AlertCircle style={{ width: 11, height: 11 }} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpinnerIcon() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      style={{ display: "flex" }}
    >
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <circle
          cx="5.5"
          cy="5.5"
          r="4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.25"
        />
        <path
          d="M5.5 1.5A4 4 0 0 1 9.5 5.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </motion.span>
  );
}
