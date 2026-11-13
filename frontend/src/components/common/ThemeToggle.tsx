import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../ThemeContext";
import { useLanguage } from "../../i18n";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const label = t(theme === "dark" ? "common.switchToLight" : "common.switchToDark");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? (
        <Sun size={16} strokeWidth={1.8} />
      ) : (
        <Moon size={16} strokeWidth={1.8} />
      )}
    </button>
  );
};

export default ThemeToggle;