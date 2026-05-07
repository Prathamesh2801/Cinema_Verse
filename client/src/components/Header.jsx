import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film,
  Tv2,
  Home,
  Search,
  X,
  UserPlus,
  LogIn,
  Bookmark,
} from "lucide-react";
import Logo from "../assets/img/logo.png";
import SearchBar from "./SearchBar";
import UserDrawer from "./UserDrawer";
import { useAuth } from "../features/auth/context/AuthContext";

/* ── Reusable avatar button — same look on desktop + mobile ── */
function AvatarButton({ user, onClick }) {
  const initials = (user?.username || user?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      title="Open account menu"
      style={{
        width: 36,
        height: 36,
        borderRadius: "var(--radius-full)",
        background:
          "linear-gradient(135deg, var(--color-gold-dim), var(--color-royal-bright))",
        border: "2px solid var(--color-gold-border)",
        boxShadow: "0 0 12px var(--color-gold-glow)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: "var(--color-bg)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {initials}
      </span>
    </motion.button>
  );
}

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/movies", label: "Movies", icon: Film },
    { to: "/tv", label: "Shows", icon: Tv2 },
  ];

  /* shared auth button base */
  const authBase = {
    borderRadius: "var(--radius-md)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "inherit",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  };
  if (loading) return null;

  return (
    <>
      {/* ════════════════════════════════════════
          DESKTOP HEADER
      ════════════════════════════════════════ */}
      <header
        className="hidden md:flex flex-col sticky top-0 w-full backdrop-blur-md"
        style={{
          background: "rgba(9,9,11,0.94)",
          borderBottom: "1px solid var(--color-border)",
          zIndex: 100,
        }}
      >
        <div className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center gap-5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-2">
            <img
              src={Logo}
              alt="CinemaVerse"
              style={{ height: 60, width: "auto", objectFit: "contain" }}
            />
            <span
              className="font-bold tracking-wide text-lg"
              style={{ color: "var(--color-text-primary)" }}
            >
              Cinema<span style={{ color: "var(--color-gold)" }}>Verse</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center justify-center gap-1 flex-1">
            {navLinks.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={
                    active
                      ? {
                          background: "var(--color-gold-glow)",
                          color: "var(--color-gold)",
                          border: "1px solid var(--color-gold-border)",
                        }
                      : {
                          color: "var(--color-text-muted)",
                          border: "1px solid transparent",
                        }
                  }
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: searchOpen
                  ? "var(--color-gold-glow)"
                  : "var(--color-bg-elevated)",
                border: `1px solid ${searchOpen ? "var(--color-gold-border)" : "var(--color-border)"}`,
              }}
            >
              {searchOpen ? (
                <X className="w-4 h-4" style={{ color: "var(--color-gold)" }} />
              ) : (
                <Search
                  className="w-4 h-4"
                  style={{ color: "var(--color-text-muted)" }}
                />
              )}
            </button>

            {/* ── Logged OUT — Login + Register ── */}
            {!user && (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      ...authBase,
                      padding: "8px 16px",
                      background: "transparent",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--color-gold-border)";
                      e.currentTarget.style.color = "var(--color-gold)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.color =
                        "var(--color-text-secondary)";
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </motion.button>
                </Link>

                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      ...authBase,
                      padding: "8px 16px",
                      background: "var(--color-gold)",
                      border: "1px solid var(--color-gold)",
                      color: "var(--color-bg)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "var(--color-gold-dim)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--color-gold)";
                    }}
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </motion.button>
                </Link>
              </div>
            )}

            {/* ── Logged IN — Avatar opens drawer ── */}
            {user && (
              <AvatarButton user={user} onClick={() => setDrawerOpen(true)} />
            )}
          </div>
        </div>

        {/* Expandable search strip */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                overflow: "visible",
                background: "rgba(9,9,11,0.98)",
                borderBottom: "1px solid var(--color-border)",
                position: "relative",
                zIndex: 200,
              }}
            >
              <div className="max-w-2xl mx-auto px-6 py-3">
                <SearchBar autoFocus onClose={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ════════════════════════════════════════
          MOBILE TOP BAR
      ════════════════════════════════════════ */}
      <header
        className="md:hidden sticky top-0 w-full backdrop-blur-md"
        style={{
          background: "rgba(9,9,11,0.94)",
          borderBottom: "1px solid var(--color-border)",
          zIndex: 100,
        }}
      >
        {/* ── Single icon row: logo  |  flex-1 spacer  |  search · login · register / avatar ── */}
        <div
          style={{
            height: 54,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: 8,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <img
              src={Logo}
              alt="CinemaVerse"
              style={{ height: 36, width: "auto", objectFit: "contain" }}
            />
            <span
              className="font-extrabold text-sm tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Cinema<span style={{ color: "var(--color-gold)" }}>Verse</span>
            </span>
          </Link>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Search icon */}
          <button
            onClick={() => setSearchOpen((v) => !v)}
            style={{
              width: 34,
              height: 34,
              borderRadius: "var(--radius-full)",
              background: searchOpen
                ? "var(--color-gold-glow)"
                : "var(--color-bg-elevated)",
              border: `1px solid ${searchOpen ? "var(--color-gold-border)" : "var(--color-border)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {searchOpen ? (
              <X className="w-4 h-4" style={{ color: "var(--color-gold)" }} />
            ) : (
              <Search
                className="w-4 h-4"
                style={{ color: "var(--color-text-muted)" }}
              />
            )}
          </button>

          {/* ── Logged OUT: Login + Register as compact icon-buttons ── */}
          {!user && (
            <>
              <Link to="/login">
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  title="Login"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-bg-elevated)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <LogIn
                    className="w-4 h-4"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                </motion.button>
              </Link>

              <Link to="/register">
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  title="Register"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-gold)",
                    border: "1px solid var(--color-gold-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <UserPlus
                    className="w-4 h-4"
                    style={{ color: "var(--color-bg)" }}
                  />
                </motion.button>
              </Link>
            </>
          )}

          {/* ── Logged IN: Avatar opens drawer ── */}
          {user && (
            <AvatarButton user={user} onClick={() => setDrawerOpen(true)} />
          )}
        </div>

        {/* Mobile search strip */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                overflow: "visible",
                background: "var(--color-bg)",
                borderBottom: "1px solid var(--color-border)",
                position: "relative",
                zIndex: 200,
              }}
            >
              <div style={{ padding: "10px 14px" }}>
                <SearchBar autoFocus onClose={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ════════════════════════════════════════
          MOBILE BOTTOM NAVIGATION
      ════════════════════════════════════════ */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-md"
        style={{
          background: "rgba(9,9,11,0.97)",
          borderTop: "1px solid var(--color-border)",
          zIndex: 50,
        }}
      >
        <div className="flex items-center justify-around h-16">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
              >
                <motion.div
                  animate={{ scale: active ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={
                    active
                      ? {
                          background: "var(--color-gold-glow)",
                          border: "1px solid var(--color-gold-border)",
                        }
                      : {
                          background: "transparent",
                          border: "1px solid transparent",
                        }
                  }
                >
                  <Icon
                    className="w-5 h-5"
                    style={{
                      color: active
                        ? "var(--color-gold)"
                        : "var(--color-text-muted)",
                    }}
                  />
                </motion.div>
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: active
                      ? "var(--color-gold)"
                      : "var(--color-text-muted)",
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ════════════════════════════════════════
          USER DRAWER  (rendered at root level)
      ════════════════════════════════════════ */}
      <UserDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
