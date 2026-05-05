import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp,
  ThumbsDown,
  Pencil,
  Trash2,
  Star,
  ChevronDown,
  CornerDownRight,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  deleteReview,
  toggleDislike,
  toggleLike,
  updateReview,
} from "../review.api";
import { useAuth } from "../../auth/context/AuthContext";
import {
  deleteReviewFromList,
  updateReviewInList,
} from "../utils/reviewHelpers";
import ReplyForm from "./ReplyForm";
import DeleteConfirmModal from "./DeleteConfirmModal";

/* ── colour-derived avatar ── */
function Avatar({ username, size = 32 }) {
  const initials = (username || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hue =
    [...(username || "x")].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `hsl(${hue},32%,20%)`,
        border: `1.5px solid hsl(${hue},42%,32%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.34,
        fontWeight: 700,
        color: `hsl(${hue},65%,72%)`,
        flexShrink: 0,
        letterSpacing: "0.04em",
      }}
    >
      {initials}
    </div>
  );
}

/* ── gold star badge ── */
function RatingBadge({ rating }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: "2px 8px",
        borderRadius: "var(--radius-full)",
        background: "var(--color-gold-glow)",
        border: "1px solid var(--color-gold-border)",
      }}
    >
      <Star
        style={{
          width: 10,
          height: 10,
          fill: "var(--color-gold)",
          color: "var(--color-gold)",
        }}
      />
      <span
        style={{ fontSize: 11, fontWeight: 700, color: "var(--color-gold)" }}
      >
        {Number(rating).toFixed(1)}
        <span style={{ opacity: 0.5, fontWeight: 500 }}>/10</span>
      </span>
    </span>
  );
}

/* ── inline star picker for edit mode ── */
function StarPicker({ value, onChange }) {
  const [hov, setHov] = useState(0);
  const eff = hov || value;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
        <motion.button
          key={v}
          whileTap={{ scale: 0.8 }}
          onClick={() => onChange(v)}
          onMouseEnter={() => setHov(v)}
          onMouseLeave={() => setHov(0)}
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
              width: 12,
              height: 12,
              fill: v <= eff ? "var(--color-gold)" : "transparent",
              color: v <= eff ? "var(--color-gold)" : "var(--color-text-muted)",
              transition: "fill 0.1s, color 0.1s",
            }}
          />
        </motion.button>
      ))}
      {value > 0 && (
        <span
          style={{
            fontSize: 11,
            color: "var(--color-gold)",
            marginLeft: 5,
            fontWeight: 700,
          }}
        >
          {value}/10
        </span>
      )}
    </div>
  );
}

/* ── relative time ── */
function relTime(d) {
  if (!d) return "";
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
  return new Date(d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ── pill action button ── */
function ActionBtn({
  icon: Icon,
  label,
  count,
  active,
  activeColor = "var(--color-gold)",
  onClick,
  disabled,
}) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={label}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 9px",
        borderRadius: "var(--radius-full)",
        background: active
          ? "var(--color-gold-glow)"
          : hov
            ? "var(--color-bg-overlay)"
            : "transparent",
        border: `1px solid ${active ? "var(--color-gold-border)" : hov ? "var(--color-border)" : "transparent"}`,
        color: active
          ? activeColor
          : hov
            ? "var(--color-text-secondary)"
            : "var(--color-text-muted)",
        fontSize: 12,
        fontWeight: active ? 700 : 500,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        transition: "all 0.14s",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Icon style={{ width: 12, height: 12 }} />
      {count != null && count > 0 && <span>{count}</span>}
      {label && !count && <span style={{ fontSize: 11.5 }}>{label}</span>}
    </motion.button>
  );
}

/* ──────────────────────────────────────────────
   MAIN ReviewItem
   Replies are stored in review.replies[] (nested
   by buildReviewTree), rendered recursively.
────────────────────────────────────────────── */
export default function ReviewItem({ review, setReviews, level = 0 }) {
  const { token, user } = useAuth();

  // ── guards ──
  const isOwn = user?.id === review.user?.id;
  const isReply = review.parentId != null; // null OR undefined → root
  const hasReplies = (review.replies?.length ?? 0) > 0;

  // ── local state ──
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(review.comment);
  const [editRating, setEditRating] = useState(review.rating ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showReplyForm, setShowReplyForm] = useState(false);
  // expand replies by default only for level 0; deeper levels start collapsed
  const [repliesExpanded, setRepliesExpanded] = useState(level === 0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
      el.focus();
    }
  }, [isEditing]);

  /* ── helpers ── */
  const withLoad = async (fn) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      console.error(e);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () =>
    withLoad(async () => {
      const u = await toggleLike(review._id, token);
      setReviews((p) => updateReviewInList(p, u));
    });

  const handleDislike = () =>
    withLoad(async () => {
      const u = await toggleDislike(review._id, token);
      setReviews((p) => updateReviewInList(p, u));
    });

  const handleUpdate = () =>
    withLoad(async () => {
      if (!editText.trim()) return;
      const payload = { review: editText };
      if (!isReply) payload.rating = editRating;
      const u = await updateReview(review._id, payload, token);
      setReviews((p) => updateReviewInList(p, u));
      setIsEditing(false);
    });

  const handleDelete = () => setShowDeleteModal(true);

  const confirmDelete = async () => {
    await deleteReview(review._id, token);
    setReviews((p) => deleteReviewFromList(p, review._id));
    toast.custom(
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "var(--color-bg-overlay)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "10px 16px",
          fontSize: 13,
          color: "var(--color-text-secondary)",
        }}
      >
        Review deleted
      </motion.div>,
      { duration: 1800 },
    );
  };

  /* cap visual indent at 3 levels */
  const indent = Math.min(level, 3) * 18;

  return (
    <div style={{ marginLeft: indent, position: "relative" }}>
      {/* indent guide */}
      {level > 0 && (
        <div
          style={{
            position: "absolute",
            left: -10,
            top: 0,
            bottom: 0,
            width: 1.5,
            background: "var(--color-border-subtle)",
            borderRadius: 2,
          }}
        />
      )}

      {/* ── card ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2 }}
        style={{
          padding: level === 0 ? "14px 16px" : "11px 13px",
          borderRadius: "var(--radius-lg)",
          background:
            level === 0
              ? "var(--color-bg-elevated)"
              : "rgba(255,255,255,0.022)",
          border: `1px solid ${level === 0 ? "var(--color-border)" : "var(--color-border-subtle)"}`,
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) =>
          level === 0 &&
          (e.currentTarget.style.borderColor = "rgba(238,205,129,0.18)")
        }
        onMouseLeave={(e) =>
          level === 0 &&
          (e.currentTarget.style.borderColor = "var(--color-border)")
        }
      >
        {/* ── header row ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 9,
            marginBottom: 10,
          }}
        >
          <Avatar
            username={review.user?.username}
            size={level === 0 ? 32 : 26}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                }}
              >
                {review.user?.username ?? "Anonymous"}
              </span>
              {isOwn && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--color-gold)",
                    background: "var(--color-gold-glow)",
                    border: "1px solid var(--color-gold-border)",
                    borderRadius: "var(--radius-full)",
                    padding: "1px 6px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  You
                </span>
              )}
              <span
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  marginLeft: "auto",
                }}
              >
                {relTime(review.createdAt)}
              </span>
            </div>
            {!isReply && review.rating > 0 && !isEditing && (
              <div style={{ marginTop: 5 }}>
                <RatingBadge rating={review.rating} />
              </div>
            )}
          </div>
        </div>

        {/* ── body / edit toggle ── */}
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 13.5,
                  lineHeight: 1.65,
                  color: "var(--color-text-secondary)",
                  wordBreak: "break-word",
                }}
              >
                {review.comment}
              </p>

              {/* ── actions ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  flexWrap: "wrap",
                }}
              >
                {/* like / dislike — only for other users when logged in */}
                {user && !isOwn && (
                  <>
                    <ActionBtn
                      icon={ThumbsUp}
                      count={review.likes}
                      active={review.likedBy?.includes(user?.id)}
                      onClick={handleLike}
                      disabled={loading}
                      label={review.likes > 0 ? null : "Like"}
                    />
                    <ActionBtn
                      icon={ThumbsDown}
                      count={review.dislikes}
                      active={review.dislikedBy?.includes(user?.id)}
                      activeColor="#f87171"
                      onClick={handleDislike}
                      disabled={loading}
                      label={review.dislikes > 0 ? null : "Dislike"}
                    />
                    <span
                      style={{
                        width: 1,
                        height: 13,
                        background: "var(--color-border-subtle)",
                        display: "inline-block",
                        margin: "0 3px",
                      }}
                    />
                  </>
                )}

                {/* reply toggle — only for other users */}
                {user && (
                  <ActionBtn
                    icon={CornerDownRight}
                    label={showReplyForm ? "Cancel" : "Reply"}
                    active={showReplyForm}
                    activeColor="var(--color-text-royal)"
                    onClick={() => setShowReplyForm((s) => !s)}
                  />
                )}

                {/* owner controls */}
                {isOwn && (
                  <>
                    <ActionBtn
                      icon={Pencil}
                      label="Edit"
                      onClick={() => setIsEditing(true)}
                    />
                    <ActionBtn
                      icon={Trash2}
                      label="Delete"
                      activeColor="#f87171"
                      onClick={handleDelete}
                      disabled={loading}
                    />
                  </>
                )}

                {/* collapse/expand replies — pushed to right */}
                {hasReplies && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRepliesExpanded((s) => !s)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginLeft: "auto",
                      padding: "4px 9px",
                      borderRadius: "var(--radius-full)",
                      background: repliesExpanded
                        ? "var(--color-bg-overlay)"
                        : "transparent",
                      border: `1px solid ${repliesExpanded ? "var(--color-border)" : "transparent"}`,
                      color: "var(--color-text-muted)",
                      fontSize: 11.5,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.14s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        "var(--color-text-secondary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-text-muted)")
                    }
                  >
                    <motion.span
                      animate={{ rotate: repliesExpanded ? 180 : 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ display: "flex" }}
                    >
                      <ChevronDown style={{ width: 12, height: 12 }} />
                    </motion.span>
                    {review.replies.length}{" "}
                    {review.replies.length === 1 ? "reply" : "replies"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            /* ── edit mode ── */
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => {
                  setEditText(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                rows={3}
                style={{
                  width: "100%",
                  background: "var(--color-bg-overlay)",
                  border: "1px solid var(--color-gold-border)",
                  borderRadius: "var(--radius-md)",
                  outline: "none",
                  resize: "none",
                  padding: "10px 12px",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  color: "var(--color-text-primary)",
                  fontFamily: "inherit",
                  caretColor: "var(--color-gold)",
                  overflow: "hidden",
                  marginBottom: 10,
                }}
              />
              {!isReply && (
                <div style={{ marginBottom: 10 }}>
                  <StarPicker value={editRating} onChange={setEditRating} />
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={handleUpdate}
                  disabled={loading || !editText.trim()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 14px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-gold-glow)",
                    border: "1px solid var(--color-gold-border)",
                    color: "var(--color-gold)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  <Check style={{ width: 12, height: 12 }} /> Save
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(review.comment);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 14px",
                    borderRadius: "var(--radius-full)",
                    background: "transparent",
                    border: "1px solid var(--color-border-subtle)",
                    color: "var(--color-text-muted)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <X style={{ width: 12, height: 12 }} /> Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── inline error ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginTop: 8,
                padding: "8px 10px",
                borderRadius: "var(--radius-md)",
                background: "rgba(220,38,38,0.07)",
                border: "1px solid rgba(220,38,38,0.18)",
              }}
            >
              <AlertCircle
                style={{ width: 12, height: 12, color: "#f87171" }}
              />
              <span style={{ fontSize: 12, color: "#fca5a5" }}>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── inline reply form ── */}
      <AnimatePresence>
        {showReplyForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", marginTop: 8, paddingLeft: 10 }}
          >
            <ReplyForm
              parentId={review._id}
              setReviews={setReviews}
              onDone={() => {
                setShowReplyForm(false);
                setRepliesExpanded(true); // auto-expand so user sees their reply
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── NESTED REPLIES (recursive) ── */}
      <AnimatePresence>
        {repliesExpanded && hasReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                marginTop: 8,
                paddingLeft: 18,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {review.replies.map((child) => (
                <ReviewItem
                  key={child._id}
                  review={child}
                  setReviews={setReviews}
                  level={level + 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
      />
    </div>
  );
}
