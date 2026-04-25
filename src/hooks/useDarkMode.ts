import { useEffect, useState } from "react";

/**
 * Tracks the current dark mode state by reading the initial preference from
 * `localStorage` and `prefers-color-scheme`, then observing class changes on
 * `<html>` via `MutationObserver` to stay in sync with Navbar's theme toggle.
 *
 * @returns `true` when dark mode is active.
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(
    () =>
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}
