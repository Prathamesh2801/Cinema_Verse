import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { TrendingUp, Tv2 } from "lucide-react";
import { getPopularMovies } from "../../movies/movie.api";
import { getPopularTV } from "../../tv/tv.api";
import RowSlider from "../../../components/RowSlider";
import Hero from "../components/Hero";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [tv, setTV] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [movieData, tvData] = await Promise.all([
          getPopularMovies(),
          getPopularTV(),
        ]);
        setMovies(movieData);
        setTV(tvData);
      } catch {
        toast.error("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-full)",
              border: "2.5px solid var(--color-bg-elevated)",
              borderTopColor: "var(--color-gold)",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
            Loading content…
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    /* pb-20 on mobile so content isn't hidden behind the bottom nav */
    <main style={{ paddingBottom: "80px" }}>
      {/* <Hero /> */}

      {/* ── Content rows ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 8 }}>
        <SectionLabel icon={TrendingUp} label="Popular Movies" />
        <RowSlider title="Popular Movies" data={movies} />

        <SectionLabel icon={Tv2} label="Popular TV Shows" />
        <RowSlider title="Popular TV Shows" data={tv} />
      </div>
    </main>
  );
}

function SectionLabel({ icon: Icon, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "0 16px",
        marginBottom: 4,
        marginTop: 6,
      }}
    >
      <Icon
        className="w-3.5 h-3.5"
        style={{ color: "var(--color-gold-dim)" }}
      />
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: "var(--color-text-muted)",
        }}
      >
        {label}
      </span>
    </div>
  );
}
