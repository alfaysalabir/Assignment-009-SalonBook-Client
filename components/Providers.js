"use client";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: { borderRadius: "999px", background: "#3a1d2b", color: "#fff", fontSize: "14px" },
          success: { iconTheme: { primary: "#d6b77f", secondary: "#3a1d2b" } },
        }}
      />
    </>
  );
}
