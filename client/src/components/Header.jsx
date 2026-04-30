import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Tv2, Home, Search, X, UserPlus, LogIn } from "lucide-react";
import Logo from '../assets/img/logo.png'
import SearchBar from "./SearchBar";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/movies", label: "Movies", icon: Film },
    { to: "/tv", label: "Shows", icon: Tv2 },
  ];

  // Auth button variants
  const authButtonBase = {
    padding: "8px 16px",
    borderRadius: "var(--radius-md)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: 6,
  };

  const loginBtnStyle = {
    background: "transparent",
    border: "1px solid var(--color-border)",
    color: "var(--color-text-secondary)",
  };

  const registerBtnStyle = {
    background: "var(--color-gold)",
    border: "1px solid var(--color-gold)",
    color: "var(--color-bg)",
  };

  return (
    <>
      {/* ── Desktop Header ── */}
      <header
        className="hidden md:flex flex-col sticky top-0 w-full backdrop-blur-md"
        style={{
          background: "rgba(9,9,11,0.94)",
          borderBottom: "1px solid var(--color-border)",
          zIndex: 100,
        }}
      >
        <div className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img 
              src={Logo} 
              alt="StreamVerse" 
              style={{ height: 70, width: 'auto', objectFit: 'contain' }}
            />
            <span
              className="font-bold tracking-wide text-lg"
              style={{ color: "var(--color-text-primary)" }}
            >
              Stream<span style={{ color: "var(--color-gold)" }}>Verse</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
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

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ ...authButtonBase, ...loginBtnStyle }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-gold-border)";
                  e.currentTarget.style.color = "var(--color-gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                }}
              >
                <LogIn className="w-4 h-4" />
                Login
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ ...authButtonBase, ...registerBtnStyle }}
              >
                <UserPlus className="w-4 h-4" />
                Register
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Expandable search strip — overflow-visible is critical so the dropdown isn't clipped */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                overflow:
                  "visible" /* must NOT be hidden — dropdown lives here */,
                background: "rgba(9,9,11,0.98)",
                borderBottom: "1px solid var(--color-border)",
                position: "relative",
                zIndex: 200 /* higher than header z:100 */,
              }}
            >
              <div className="max-w-2xl mx-auto px-6 py-3">
                <SearchBar autoFocus onClose={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile Top Bar ── */}
      <header
        className="md:hidden sticky top-0 w-full backdrop-blur-md"
        style={{
          background: "rgba(9,9,11,0.94)",
          borderBottom: "1px solid var(--color-border)",
          zIndex: 100,
        }}
      >
        <div className="h-16 flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={Logo} 
              alt="StreamVerse" 
              style={{ height: 40, width: 'auto', objectFit: 'contain' }}
            />
            <span
              className="font-extrabold text-base tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Stream<span style={{ color: "var(--color-gold)" }}>Verse</span>
            </span>
          </Link>

          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
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
        </div>

        {/* Mobile Auth Buttons - subtle & minimal */}
        <div className="flex items-center gap-2 px-4 pb-3">
          <Link to="/login" className="flex-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5"
              style={{
                background: "transparent",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-muted)",
              }}
            >
              <LogIn className="w-3 h-3" />
              Login
            </motion.button>
          </Link>
          <Link to="/register" className="flex-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5"
              style={{
                background: "var(--color-gold-dim)",
                border: "1px solid var(--color-gold-border)",
                color: "var(--color-gold)",
              }}
            >
              <UserPlus className="w-3 h-3" />
              Register
            </motion.button>
          </Link>
        </div>

        {/* Mobile search strip — overflow visible so results drop below */}
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
              <div className="px-4 py-3">
                <SearchBar autoFocus onClose={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile Bottom Navigation ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-md"
        style={{
          background: "rgba(9,9,11,0.97)",
          borderTop: "1px solid var(--color-border)",
          zIndex: 50 /* below search (200) but above page content */,
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
    </>
  );
}
