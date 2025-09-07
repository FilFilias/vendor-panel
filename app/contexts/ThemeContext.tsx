// app/components/ThemeContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import { useFetcher } from "react-router";

export type Theme = "dark" | "light" | "system";

export type ThemeProviderProps = {
  defaultTheme: Theme;
};

type State = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<State | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme,
}: PropsWithChildren<ThemeProviderProps>) {
  // 1. Seed from defaultTheme (SSR+client)
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // For persisting back to the server
  const fetcher = useFetcher();

  // 2. Whenever `theme` changes, update <html> class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const sys = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(sys);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // 3. Wrap setTheme so we both update React state
  //    and tell the server to set a cookie for next SSR.
  const setTheme = (newTheme: Theme) => {
    // immediate UI update
    setThemeState(newTheme);

    // persist via your action
    fetcher.submit(
      { theme: newTheme },
      {
        action: "/actions/set-theme", // your action route
        method: "get"
      }
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
