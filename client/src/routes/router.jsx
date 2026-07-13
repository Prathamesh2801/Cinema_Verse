import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../features/home/pages/HomePage";
import DetailPage from "../features/media/pages/DetailPage";
import MoviePage from "../features/movies/pages/MoviePage";
import TVPage from "../features/tv/pages/TVPage";
import SearchPage from "../features/search/pages/SearchPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ProfilePage from "../features/auth/pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import BookmarkPage from "../features/bookmark/pages/BookmarkPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/:type/:id", element: <DetailPage /> },
      { path: "/movies", element: <MoviePage /> },
      { path: "/tv", element: <TVPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        path: "/bookmarks",
        element: (
          <ProtectedRoute>
            <BookmarkPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
