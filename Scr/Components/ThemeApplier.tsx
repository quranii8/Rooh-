"use client";

import { useEffect } from "react";
import { useQuranStore } from "@/lib/store";

/** يطبّق الثيم على <html> بعد hydration */
export function ThemeApplier() {
  const theme = useQuranStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
}
