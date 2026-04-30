import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthContext";
import router from "./routes/router";
import { BookmarkProvider } from "./features/bookmark/context/BookmarkContext";

export default function App() {
  return (
    <>
      <AuthProvider>
        <BookmarkProvider>
          <RouterProvider router={router} />
        </BookmarkProvider>
      </AuthProvider>
    </>
  );
}
