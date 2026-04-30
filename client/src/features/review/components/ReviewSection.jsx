import { useEffect, useState } from "react";
import { getReviews } from "../review.api";
import { useAuth } from "../../auth/context/AuthContext";

import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

export default function ReviewSection({ mediaId }) {
  const { user, token } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getReviews(mediaId);
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [mediaId]);

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Reviews</h2>

      {user && (
        <ReviewForm
          mediaId={mediaId}
          onAdd={(newReview) =>
            setReviews((prev) => [newReview, ...prev])
          }
        />
      )}

      <ReviewList reviews={reviews} />
    </div>
  );
}