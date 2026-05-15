import { motion } from "framer-motion";
import Logo from "../assets/img/logo.png";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090b] text-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 rounded-[24px] border border-white/10 bg-[#0d0d10]/90 p-8 shadow-[0_28px_120px_rgba(0,0,0,0.55)]"
      >
        <motion.img
          src={Logo}
          alt="CinemaVerse logo"
          className="h-24 w-auto"
          initial={{ scale: 0.92, rotate: -6 }}
          animate={{ scale: [0.92, 1, 0.95], rotate: [-6, 6, -6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-lg font-semibold tracking-[0.24em] uppercase text-white sm:text-xl">
            Loading <span className="text-[#EECD81]">CinemaVerse</span>
          </p>
          <p className="max-w-xs text-sm text-[#C8C2B0] sm:text-base">
            Fetching trending media, reviews, and your curated watchlist...
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.span
            className="h-3 w-3 rounded-full bg-[#EECD81]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="h-1.5 w-24 rounded-full bg-gradient-to-r from-[#EECD81] via-[#c9a84c] to-[#7BAAF7]"
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
