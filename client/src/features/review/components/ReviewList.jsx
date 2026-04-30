import ReviewItem from "./ReviewItem";

export default function ReviewList({ reviews }) {
  if (!reviews.length) return <p>No reviews yet</p>;

  return (
    <div>
      {reviews.map((r) => (
        <ReviewItem key={r._id} review={r} />
      ))}
    </div>
  );
}