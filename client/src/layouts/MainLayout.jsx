import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div
      style={{
        background: "var(--color-bg)",
        color: "var(--color-text-primary)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <div style={{ flex: 1 }}>
        <Outlet />
      </div>

      <Footer />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--color-bg-overlay)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-gold-border)",
            borderRadius: "var(--radius-lg)",
            fontSize: 13,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          },
          success: {
            iconTheme: {
              primary:   "#EECD81",   /* --color-gold */
              secondary: "#18181b",   /* --color-bg-overlay */
            },
          },
          error: {
            iconTheme: {
              primary:   "#EECD81",
              secondary: "#18181b",
            },
          },
        }}
      />
    </div>
  );
}