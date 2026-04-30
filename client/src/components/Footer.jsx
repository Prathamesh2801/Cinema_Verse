import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Logo from '../assets/img/logo.png';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
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
                alt="StreamVerse" 
                style={{ height: 60, width: 'auto', objectFit: 'contain' }}
              />
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                }}
              >
                Stream<span style={{ color: "var(--color-gold)" }}>Verse</span>
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
              Discover movies and TV shows. Powered by TMDB.
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
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { icon: FaLinkedin, label: "Linkedin" },
              { icon: FaGithub, label: "GitHub" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-bg-overlay)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "border-color 0.2s, background 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-gold-border)";
                  e.currentTarget.style.background = "var(--color-gold-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.background = "var(--color-bg-overlay)";
                }}
              >
                <Icon
                  className="w-4 h-4"
                  style={{ color: "var(--color-text-muted)" }}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom rule */}
        <div
          style={{
            borderTop: "1px solid var(--color-border-subtle)",
            marginTop: 28,
            paddingTop: 20,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            color: "var(--color-text-muted)",
          }}
        >
          <span>
            © {new Date().getFullYear()} StreamVerse. All rights reserved.
          </span>
          <span>
            Data provided by{" "}
            <span style={{ color: "var(--color-text-secondary)" }}>TMDB</span>
          </span>
        </div>
      </div>
    </motion.footer>
  );
}
