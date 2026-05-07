import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Logo from "../assets/img/logo.png";
import { href } from "react-router-dom";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="pb-16 md:pb-0"
      style={{
        background: "var(--color-bg-elevated)",
        borderTop: "1px solid var(--color-border)",
        color: "var(--color-text-muted)",
        marginTop: 40,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 24px" }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 32,
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img
                src={Logo}
                alt="CinemaVerse"
                style={{ height: 60, width: "auto", objectFit: "contain" }}
              />
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                }}
              >
                Cinema<span style={{ color: "var(--color-gold)" }}>Verse</span>
              </span>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--color-text-muted)",
                maxWidth: 220,
                lineHeight: 1.55,
              }}
            >
              Discover trending movies, TV shows, reviews, and bookmarks —
              powered by TMDB.
            </p>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--color-text-muted)",
                marginBottom: 2,
              }}
            >
              Browse
            </span>
            {[
              { href: "/", label: "Home" },
              { href: "/movies", label: "Movies" },
              { href: "/tv", label: "TV Shows" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                style={{
                  fontSize: 13,
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-gold)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-text-secondary)")
                }
              >
                {label}
              </a>
            ))}
          </div>

          {/* Social */}
          {/* Social */}
          <div
            style={{
              display: "flex",
              flexDirection: window.innerWidth < 768 ? "row" : "column",
              alignItems: window.innerWidth < 768 ? "center" : "flex-end",
              justifyContent: "space-between",
              gap: window.innerWidth < 768 ? 12 : 14,
              width: window.innerWidth < 768 ? "100%" : "auto",
              minWidth: window.innerWidth < 768 ? "100%" : 240,
            }}
          >
            {/* Icons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexShrink: 0,
              }}
            >
              {[
                {
                  icon: FaLinkedin,
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/in/prathamesh-kamble-51b8502a5/",
                },
                {
                  icon: FaGithub,
                  label: "GitHub",
                  href: "https://github.com/Prathamesh2801",
                },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--color-bg-overlay)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.25s ease",
                    textDecoration: "none",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "var(--color-gold-border)";
                    e.currentTarget.style.background = "var(--color-gold-glow)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.background =
                      "var(--color-bg-overlay)";
                    e.currentTarget.style.transform = "translateY(0px)";
                  }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{
                      color: "var(--color-text-muted)",
                    }}
                  />
                </a>
              ))}
            </div>

            {/* Tech Stack */}
            <span
              style={{
                fontSize: 11,
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
                textAlign: window.innerWidth < 768 ? "right" : "right",
                whiteSpace: "nowrap",
              }}
            >
              Built with React.js , Node.js & MongoDB
            </span>
          </div>
        </div>

        {/* Bottom rule */}
        <div
          style={{
            borderTop: "1px solid var(--color-border-subtle)",
            marginTop: 10,
            paddingTop: 10,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            color: "var(--color-text-muted)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
              width: "100%",
            }}
          >
            <span>
              © {new Date().getFullYear()}{" "}
              <span
                style={{
                  color: "var(--color-gold)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                CinemaVerse
              </span>{" "}
            </span>

            <span>
              Designed & Developed by{" "}
              <a
                href="https://www.linkedin.com/in/prathamesh-kamble-51b8502a5/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--color-gold)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Prathamesh Kamble
              </a>
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
