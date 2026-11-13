import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Globe2,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../i18n";
import { languageNames, supportedLanguages, type Language } from "../../i18n/translations";
import ThemeToggle from "../common/ThemeToggle";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const location = useLocation();

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 30);
        frame = 0;
      });
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setLanguageOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.classList.toggle("menu-open", open);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setLanguageOpen(false);
  }, [location.pathname]);

  const links = [
    [t("nav.home"), "/"],
    [t("nav.about"), "/about"],
    [t("nav.drones"), "/drones"],
    [t("nav.services"), "/services"],
    [t("nav.subsidy"), "/subsidy"],
    [t("nav.gallery"), "/gallery"],
    [t("nav.contact"), "/contact"],
  ];

  const languages = supportedLanguages.map((code) => ({
    code,
    name: languageNames[code],
  }));

  const selectLanguage = (code: Language) => {
    setLanguage(code);
    setLanguageOpen(false);
  };

  return (
    <>
    <a className="skip-link" href="#main-content">
      {language === "hi"
        ? "मुख्य सामग्री पर जाएँ"
        : language === "mr"
          ? "मुख्य मजकुराकडे जा"
          : t("common.skipToContent")}
    </a>
    <header
      className={`site-header ${scrolled ? 'scrolled' : ''} ${
        location.pathname === '/' && !scrolled ? 'overlay' : ''
      }`}
    >
      <div className="nav-wrap">
        <Link to="/" className="logo" aria-label={t("nav.homeAria")}>
          <img src="/assets/branding/amulya-logo-transparent.webp" alt="Amulya Agrotech" />
        </Link>

        <nav id="primary-navigation" aria-label={t("nav.navigation", "Main navigation")} className={open ? "nav-open" : ""}>
          {links.map(([label, path]) => {
            const isActive = path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={isActive ? "active" : ""}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}

          <div className="language-wrapper">
            <button
              type="button"
              className="language-button"
              onClick={() => setLanguageOpen(!languageOpen)}
              aria-label={t("nav.selectLanguage")}
              aria-expanded={languageOpen}
            >
              <Globe2 size={17} />
              <span>{language.toUpperCase()}</span>
              <ChevronDown size={14} className={languageOpen ? "rotate" : ""} />
            </button>

            {languageOpen && (
              <div className="language-menu">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    className={language === item.code ? "language-option selected" : "language-option"}
                    onClick={() => selectLanguage(item.code)}
                  >
                    <span>{item.name}</span>
                    {language === item.code && <span className="language-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <ThemeToggle />

          <Link className="nav-quote" to="/quotation">
            {t("nav.quotation")}
            <ArrowUpRight size={16} />
          </Link>
        </nav>

        <button
          type="button"
          className="icon-button menu-button"
          onClick={() => setOpen(!open)}
          aria-label={t("nav.menu")}
          aria-expanded={open}
          aria-controls="primary-navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
    </>
  );
}