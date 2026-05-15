const BASE_IMAGE_URL = "https://image.tmdb.org/t/p";

export const IMAGE_SIZES = {
  verySmall: "w185",
  small: "w342",
  medium: "w500",
  large: "w780",
  xlarge: "w1280",
  full: "original",
};
export const getImageUrl = (path, size = IMAGE_SIZES.medium) => {
  if (!path) return "/fallback.jpg";

  return `${BASE_IMAGE_URL}/${size}${path}`;
};
