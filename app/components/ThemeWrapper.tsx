"use client";

import { useTheme } from "next-themes";
import React, { createContext, useContext } from "react";

type ThemeContextType = {
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({ isDark: false });

export const useThemeContext = () => useContext(ThemeContext);

type Props = {
  children: React.ReactNode;
};

export default function ThemeWrapper({ children }: Props) {
  console.log("ThemeWrapper");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ThemeContext.Provider value={{ isDark }}>{children}</ThemeContext.Provider>
  );
}
