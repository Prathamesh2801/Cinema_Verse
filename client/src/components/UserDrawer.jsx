import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Bookmark, LogOut, ChevronRight, Shield } from "lucide-react";
import { useAuth } from "../features/auth/context/AuthContext";

/* ── helpers ── */
function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function NavRow({ icon: Icon, label, to, onClick, danger = false }) {
  const location = useLocation();
  const isActive = to && location.pathname.startsWith(to);

  const color = danger ? "#f87171" : "var(--color-text-secondary)";
  const hoverBg = danger ? "rgba(248,113,113,0.08)" : "var(--color-gold-glow)";
  const hoverBorder = danger
    ? "rgba(248,113,113,0.25)"
    : "var(--color-gold-border)";

  const inner = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderRadius: "var(--radius-lg)",
        border: isActive
          ? "1px solid var(--color-gold-border)"
          : "1px solid transparent",

        background: isActive ? "var(--color-gold-glow)" : "transparent",
        cursor: "pointer",
        transition: "background 0.18s, border-color 0.18s",
        color: isActive ? "var(--color-gold)" : color,
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hoverBg;
        e.currentTarget.style.borderColor = hoverBorder;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.borderColor = "transparent";
      }}
      onClick={onClick}
    >
      <Icon
        style={{
          width: 17,
          height: 17,
          flexShrink: 0,
          color: danger ? "#f87171" : "var(--color-gold-dim)",
        }}
      />
      <span
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: 500,
          color,
        }}
      >
        {label}
      </span>
      {!danger && (
        <ChevronRight
          style={{ width: 14, height: 14, color: "var(--color-text-muted)" }}
        />
      )}
    </div>
  );

  return to ? (
    <Link to={to} style={{ textDecoration: "none" }}>
      {inner}
    </Link>
  ) : (
    inner
  );
}

export default function UserDrawer({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  /* close on outside click */
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  /* lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* close on Escape */
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(3px)",
              zIndex: 500,
            }}
          />

          {/* ── Drawer panel ── */}
          <motion.aside
            key="drawer-panel"
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(320px, 88vw)",
              background: "var(--color-bg-overlay)",
              borderLeft: "1px solid var(--color-gold-border)",
              zIndex: 501,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Ambient glow inside drawer */}
            <div
              style={{
                position: "absolute",
                top: -80,
                right: -80,
                width: 220,
                height: 220,
                borderRadius: "50%",
                background: "var(--color-gold-glow)",
                filter: "blur(55px)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -60,
                left: -60,
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: "var(--color-royal-dim)",
                filter: "blur(48px)",
                pointerEvents: "none",
                opacity: 0.5,
              }}
            />

            {/* ── Header bar ── */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 16px 14px",
                borderBottom: "1px solid var(--color-border-subtle)",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--color-text-muted)",
                }}
              >
                Account
              </span>
              <button
                onClick={onClose}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor =
                    "var(--color-gold-border)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--color-border)")
                }
              >
                <X
                  style={{
                    width: 14,
                    height: 14,
                    color: "var(--color-text-muted)",
                  }}
                />
              </button>
            </div>

            {/* ── Avatar + user info ── */}
            <div
              style={{
                position: "relative",
                padding: "24px 20px 20px",
                borderBottom: "1px solid var(--color-border-subtle)",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Avatar circle */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "var(--radius-full)",
                    background:
                      "linear-gradient(135deg, var(--color-gold-dim), var(--color-royal-bright))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    border: "2px solid var(--color-gold-border)",
                    boxShadow: "0 0 20px var(--color-gold-glow)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "var(--color-bg)",
                      lineHeight: 1,
                    }}
                  >
                    {getInitials(user?.username || user?.name || "U")}
                  </span>
                </div>

                {/* Name + email */}
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--color-text-primary)",
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user?.username || user?.name || "User"}
                  </p>
                  {user?.email && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--color-text-muted)",
                        margin: "3px 0 0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {user.email}
                    </p>
                  )}
                  {/* Member badge */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 6,
                      padding: "2px 8px",
                      borderRadius: "var(--radius-full)",
                      background: "var(--color-gold-glow)",
                      border: "1px solid var(--color-gold-border)",
                    }}
                  >
                    <Shield
                      style={{
                        width: 10,
                        height: 10,
                        color: "var(--color-gold-dim)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: "var(--color-gold-dim)",
                      }}
                    >
                      Member
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Nav items ── */}
            <div
              style={{
                position: "relative",
                flex: 1,
                padding: "12px 8px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                overflowY: "auto",
              }}
            >
              <NavRow
                icon={User}
                label="Profile"
                to="/profile"
                onClick={onClose}
              />
              <NavRow
                icon={Bookmark}
                label="Bookmarks"
                to="/bookmarks"
                onClick={onClose}
              />
            </div>

            {/* ── Logout at bottom ── */}
            <div
              style={{
                position: "relative",
                padding: "8px 8px 24px",
                borderTop: "1px solid var(--color-border-subtle)",
                flexShrink: 0,
              }}
            >
              <NavRow
                icon={LogOut}
                label="Log Out"
                danger
                onClick={handleLogout}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
