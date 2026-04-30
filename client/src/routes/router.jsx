import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import HomePage from "../features/home/pages/HomePage";
import DetailPage from "../features/media/pages/DetailPage";
import MoviePage from "../features/movies/pages/MoviePage";
import TVPage from "../features/tv/pages/TVPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/:type/:id", element: <DetailPage /> },
      { path: "/movies", element: <MoviePage /> },
      { path: "/tv", element: <TVPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
]);

export default router;
