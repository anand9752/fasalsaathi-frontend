// useLanguage.ts
import { useState, useEffect } from "react";

export type Language = "en" | "hi" | "mr" | "pa";

export function useLanguage() {
  // Get initial language from storage, default to English
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("fs_lang") as Language) || "en";
  });

  useEffect(() => {
    // Listen for language changes from other components
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<Language>;
      setLang(customEvent.detail);
    };

    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const changeLanguage = (newLang: Language) => {
    localStorage.setItem("fs_lang", newLang);
    setLang(newLang);
    // Broadcast the change to all other components instantly
    window.dispatchEvent(new CustomEvent("languageChange", { detail: newLang }));
  };

  return { lang, changeLanguage };
}