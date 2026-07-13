export const SORT_OPTIONS = [
  { value: "popularity", label: "Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

export const DEFAULT_SORT = "popularity";

// Year selector: current year down to 1970, plus "All years".
const CURRENT_YEAR = new Date().getFullYear();

export const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - 1970 + 1 },
  (_, i) => CURRENT_YEAR - i,
);
