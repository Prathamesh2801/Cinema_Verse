import { useState } from "react";
import { createReview } from "../review.api";
import { useAuth } from "../../auth/context/AuthContext";

export default function ReviewForm({ mediaId, onAdd }) {
  const { token } = useAuth();
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      const newReview = await createReview(
        { movieId: Number(mediaId), review: text, rating: 5 },
        token,
      );

      onAdd(newReview);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your review..."
      />

      <button onClick={handleSubmit}>Post</button>
    </div>
  );
}
