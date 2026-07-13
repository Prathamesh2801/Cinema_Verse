import { useState } from "react";

/**
 * Avatar — shared circular avatar. Shows the user's image when present (and it
 * loads), otherwise a gold/royal gradient with initials. Used in Header,
 * Drawer, and the Profile page.
 */
function getInitials(user) {
  const source = user?.fullName || user?.username || "U";
  return source
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ user, size = 40, fontSize }) {
  // Track the URL that failed so a new/edited avatar URL is retried automatically
  // (no effect needed — this stays correct as user.avatar changes).
  const [erroredSrc, setErroredSrc] = useState(null);

  const showImage = !!user?.avatar && erroredSrc !== user.avatar;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "var(--radius-full)",
        overflow: "hidden",
        flexShrink: 0,
        border: "2px solid var(--color-gold-border)",
        boxShadow: "0 0 12px var(--color-gold-glow)",
        background: showImage
          ? "var(--color-bg-elevated)"
          : "linear-gradient(135deg, var(--color-gold-dim), var(--color-royal-bright))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showImage ? (
        <img
          src={user.avatar}
          alt={user.fullName || user.username}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => setErroredSrc(user.avatar)}
        />
      ) : (
        <span
          style={{
            fontSize: fontSize || size * 0.38,
            fontWeight: 800,
            color: "var(--color-bg)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {getInitials(user)}
        </span>
      )}
    </div>
  );
}
