"use client";
import { useEffect } from "react";

export function InitialLoaderRemover() {
  useEffect(() => {
    const removeLoader = () => {
      const loader = document.getElementById("initial-loader");
      if (loader) loader.style.display = "none";
    };

    if (document.readyState === "complete") {
      removeLoader();
    } else {
      window.addEventListener("load", removeLoader);
      return () => window.removeEventListener("load", removeLoader);
    }
  }, []);
  return null;
}
