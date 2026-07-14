/* The note-draft effect intentionally syncs local state when the entry loads. */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bookmark, Play, Check, Star, Trash2, LogIn } from "lucide-react";
import toast from "react-hot-toast";

import { useLibrary } from "../context/BookmarkContext";
import { useAuth } from "../../auth/context/AuthContext";

const STATUS_OPTIONS = [
  { value: "want", label: "Want to Watch", icon: Bookmark },
  { value: "watching", label: "Watching", icon: Play },
  { value: "watched", label: "Watched", icon: Check },
];

/**
 * StatusControl — set library status (Want/Watching/Watched) + a personal
 * 1–5★ rating and a note. Self-contained: reads/writes via the library context.
 * `item` = { id, media_type }.
 */
export default function StatusControl({ item }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getEntry, setStatus, setRating, setNote, remove } = useLibrary();

  const entry = getEntry(item.id, item.media_type);
  const status = entry?.status || null;
  const rating = entry?.rating || 0;

  const [hoverRating, setHoverRating] = useState(0);
  const [noteDraft, setNoteDraft] = useState(entry?.note || "");

  // Keep the note textarea in sync when the entry loads/changes.
  useEffect(() => {
    setNoteDraft(entry?.note || "");
  }, [entry?.note]);

  /* ── Signed-out prompt ── */
  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          padding: "16px 18px",
          borderRadius: "var(--radius-lg)",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
        }}
      >
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
          Sign in to track this in your library.
        </span>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/login")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: "var(--radius-full)",
            background: "var(--color-gold)",
            border: "none",
            color: "var(--color-bg)",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <LogIn style={{ width: 13, height: 13 }} />
          Sign in
        </motion.button>
      </div>
    );
  }

  const handleStatus = (value) => {
    setStatus(item, value);
    const label = STATUS_OPTIONS.find((s) => s.value === value)?.label;
    toast.success(`Marked as “${label}”`);
  };

  const handleRemove = () => {
    remove(item);
    toast.success("Removed from library");
  };

  return (
    <div
      style={{
        padding: "18px",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Status segmented control */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {STATUS_OPTIONS.map(({ value, label, icon: Icon }) => {
          const active = status === value;
          return (
            <motion.button
              key={value}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleStatus(value)}
              style={{
                flex: "1 1 auto",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "9px 12px",
                borderRadius: "var(--radius-md)",
                background: active ? "var(--color-gold)" : "transparent",
                border: `1px solid ${
                  active ? "var(--color-gold)" : "var(--color-border)"
                }`,
                color: active ? "var(--color-bg)" : "var(--color-text-secondary)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.18s, border-color 0.18s, color 0.18s",
                whiteSpace: "nowrap",
              }}
            >
              <Icon style={{ width: 14, height: 14 }} />
              {label}
            </motion.button>
          );
        })}
      </div>

      {/* Rating + note — only once the item is in the library */}
      {entry && (
        <div style={{ marginTop: 16 }}>
          {/* Star rating */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--color-text-muted)",
              }}
            >
              Your rating
            </span>
            <div
              style={{ display: "flex", gap: 3 }}
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => {
                const filled = (hoverRating || rating) >= n;
                return (
                  <button
                    key={n}
                    onMouseEnter={() => setHoverRating(n)}
                    onClick={() => setRating(item, rating === n ? 0 : n)}
                    title={`${n} star${n > 1 ? "s" : ""}`}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 2,
                      cursor: "pointer",
                      lineHeight: 0,
                    }}
                  >
                    <Star
                      style={{
                        width: 20,
                        height: 20,
                        fill: filled ? "var(--color-gold)" : "transparent",
                        color: filled
                          ? "var(--color-gold)"
                          : "var(--color-text-muted)",
                        transition: "fill 0.15s, color 0.15s",
                      }}
                    />
                  </button>
                );
              })}
            </div>
            {rating > 0 && (
              <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                {rating}/5
              </span>
            )}
          </div>

          {/* Note */}
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            onBlur={() => {
              if (noteDraft !== (entry.note || "")) setNote(item, noteDraft);
            }}
            placeholder="Add a private note…"
            rows={2}
            style={{
              width: "100%",
              resize: "vertical",
              padding: "10px 12px",
              background: "var(--color-bg-overlay)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              color: "var(--color-text-primary)",
              fontSize: 13,
              fontFamily: "inherit",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--color-gold-border)";
            }}
          />

          {/* Remove */}
          <button
            onClick={handleRemove}
            style={{
              marginTop: 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 12px",
              borderRadius: "var(--radius-full)",
              background: "transparent",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-muted)",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Trash2 style={{ width: 12, height: 12 }} />
            Remove from library
          </button>
        </div>
      )}
    </div>
  );
}
