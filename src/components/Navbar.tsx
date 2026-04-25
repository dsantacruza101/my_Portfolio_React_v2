import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Sun, Moon, Languages } from "lucide-react";
/**
 * Fixed navigation bar with dark mode toggle and EN/ES language switcher.
 * Persists the theme preference to `localStorage` and applies the `dark` class
 * to `<html>` so Tailwind dark-mode utilities take effect globally.
 */
export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark"); 
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light"); 
    }
  }, [isDark]);
  /** Toggles between English and Spanish, defaulting to English for any non-Spanish locale. */
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language.includes("es") ? "en" : "es");
  };
  const navLinks = [
    { name: t("nav.about"), href: "#about" },
    { name: t("nav.projects"), href: "#projects" },
    { name: t("nav.skills"), href: "#skills" },
    { name: t("nav.contact"), href: "#contact" },
  ];
  return (
    <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <a href="#home">
          <span className="text-2xl font-black bg-linear-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
            DS.
          </span>
        </a>
        {}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors font-medium"
            >
              {link.name}
            </a>
          ))}
          <div className="flex items-center border-l border-slate-300 dark:border-slate-700 ml-4 pl-4 space-x-4">
            {}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors"
            >
              <Languages size={20} />
              <span className="text-xs font-bold">
                {i18n.language.toUpperCase()}
              </span>
            </button>
            {}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
