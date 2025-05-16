'use client';
import { useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";

const useColorMode = () => {
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");
  const [isMounted, setIsMounted] = useState(false);

  // 1. Server və Client arasında uyğunsuzluğun qarşısını almaq
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Dark/Light mode tətbiq etmək
  useEffect(() => {
    if (!isMounted) return;

    const className = "dark";
    const bodyClass = document.body.classList;

    // 3. Sistem tema parametrlərinə uyğun ilkin dəyər
    if (colorMode === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      isDark ? bodyClass.add(className) : bodyClass.remove(className);
    } else {
      colorMode === "dark" ? bodyClass.add(className) : bodyClass.remove(className);
    }
  }, [colorMode, isMounted]);

  // 4. Sistem temasını izləmək üçün əlavə
  useEffect(() => {
    if (!isMounted || colorMode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setColorMode("system");
    
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [isMounted, colorMode]);

  return [colorMode, setColorMode] as const;
};

export default useColorMode;