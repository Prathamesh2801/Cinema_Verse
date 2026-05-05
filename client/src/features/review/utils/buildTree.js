export function buildReviewTree(reviews) {
  const map = {};
  const roots = [];

  // Step 1: map all reviews
  reviews.forEach((r) => {
    map[r._id] = { ...r, replies: [] };
  });

  // Step 2: build tree
  reviews.forEach((r) => {
    if (r.parentId) {
      if (map[r.parentId]) {
        map[r.parentId].replies.push(map[r._id]);
      }
    } else {
      roots.push(map[r._id]);
    }
  });

  return roots;
}