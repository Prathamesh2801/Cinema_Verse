import axios from "axios";

const tmdbClient = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
  timeout: 10000, // 10 seconds timeout for all TMDB requests
});

tmdbClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("TMDB Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default tmdbClient;
