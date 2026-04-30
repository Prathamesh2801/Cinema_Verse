import { useAuth } from "../../auth/context/AuthContext";
import { toggleLike } from "../review.api";

export default function ReviewItem({ review }) {
  const { user, token } = useAuth();

  const handleLike = async () => {
    try {
      const updated = await toggleLike(review._id, token);

      // ❗ We'll handle update later
      console.log(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <strong>{review.username}</strong>

      <p>{review.comment}</p>

      <button onClick={handleLike}>👍 {review.likes?.length || 0}</button>

      {review.replies?.map((reply) => (
        <div key={reply._id} style={{ marginLeft: 20 }}>
          <strong>{reply.username}</strong>
          <p>{reply.comment}</p>
        </div>
      ))}
    </div>
  );
}
