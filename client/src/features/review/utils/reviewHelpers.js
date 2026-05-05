export function updateReviewInList(list, updated) {
  return list.map((item) =>
    item._id === updated._id ? { ...item, ...updated } : item,
  );
}

export function addReplyToList(list, reply) {
  return [...list, reply];
}

export function deleteReviewFromList(list, id) {
  return list.filter((item) => item._id !== id && item.parentId !== id);
}
