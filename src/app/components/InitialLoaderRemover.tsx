"use client";

import { useEffect } from "react";

export function InitialLoaderRemover() {
  useEffect(() => {
    const loader = document.getElementById("initial-loader");
    if (loader) loader.style.display = "none";
  }, []);

  return null;
}
