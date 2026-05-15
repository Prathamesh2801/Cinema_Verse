import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { TrendingUp, Tv2, Clock } from "lucide-react";
import {
  getPopularMovies,
  getLatestMovies,
  getTopRatedMovies,
} from "../movie.api";
import MediaRow from "../../../features/media/components/MediaRow";

export default function MoviePage() {
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const [p, t, n] = await Promise.all([
          getPopularMovies(),
          getTopRatedMovies(),
          getLatestMovies(),
        ]);
        setPopular(p);
        setTopRated(t);
        setNowPlaying(n);
      } catch {
        toast.error("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
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
      {/* ── Content rows ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 8 }}>
        <SectionLabel icon={TrendingUp} label="Popular Movies" />
        <MediaRow title="Popular Movies" data={popular} />

        <SectionLabel icon={Tv2} label="Top Rated Movies" />
        <MediaRow title="Top Rated Movies" data={topRated} />

        <SectionLabel icon={Tv2} label="Latest Movies" />
        <MediaRow title="Latest Movies" data={nowPlaying} />
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
