"use client";
import { useEffect } from "react";

export default function UnauthorizedReload() {
  useEffect(() => {
    window.location.reload(); // ✅ runs only in browser
  }, []);

  return (
    <p className="text-center text-red-500">
      ❌ Unauthorized or no student user found. Refreshing...
    </p>
  );
}
