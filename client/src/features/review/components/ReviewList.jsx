import { motion, AnimatePresence } from "framer-motion";
import ReviewItem from "./ReviewItem";

export default function ReviewList({ reviews, setReviews }) {
  if (!reviews.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <AnimatePresence initial={false}>
        {reviews.map((r, i) => (
          <motion.div
            key={r._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -12, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.22, delay: i < 5 ? i * 0.04 : 0 }}
          >
            <ReviewItem review={r} setReviews={setReviews} level={0} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}