import React, { useEffect, useRef, useState } from "react";
import classes from './ThemeLanguageNav.module.scss';
import { useTranslation } from "react-i18next";
import icons from '../../../../assets/nav_icons/nav_Icons';
import { useIconConfig } from "../../../../context/IconConfigContext";
import LanguageDropdown from "./languageDropdown/LanguageDropdown";

const {
  LightThemeIcon,
  NightThemeIcon,
  LanguageIcon
} = icons;

const ThemeLanguageNav = () => {
  const { iconConfig } = useIconConfig();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const rippleRef = useRef(null);
  const { t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [iconSwapped, setIconSwapped] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const iconRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = (e) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIconSwapped(false);

    const newTheme = theme === 'light' ? 'dark' : 'light';
    const ripple = rippleRef.current;
    const html = document.documentElement;

    const x = e.clientX;
    const y = e.clientY;
    const size = Math.max(window.innerWidth, window.innerHeight) * 2;

    ripple.style.setProperty('background-color', newTheme === 'dark' ? '#121212' : '#F5F5F5');
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;
    ripple.style.transition = 'transform 0.6s ease-out, opacity 0.4s ease';

    ripple.style.transform = 'scale(0)';
    ripple.style.opacity = '1';

    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(1)';
    });

    setTimeout(() => {
      setTheme(newTheme);
      html.setAttribute('data-theme', newTheme);
      setIconSwapped(true);
    }, 300);

    setTimeout(() => {
      ripple.style.opacity = '0';
      ripple.style.transform = 'scale(0)';
      setIsAnimating(false);
    }, 600);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        !iconRef.current?.contains(event.target) &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const renderIcon = () => {
    const IconComponent = theme === "light" ? LightThemeIcon : NightThemeIcon;
    return <IconComponent color={iconConfig.color} width="28px" height="28px" />;
  };

  return (
    <>
      <div className={classes.menu_container}>
        <div className={classes.menu_theme}>
          <button
            onClick={toggleTheme}
            className={`${classes.menu_button} ${isAnimating ? classes.spinBackForward : ""}`}
            aria-label={t(theme === 'light' ? 'lightTheme' : 'darkTheme')}
            title={t(theme === 'light' ? 'lightTheme' : 'darkTheme')}
          >
            {renderIcon()}
          </button>
        </div>

        <div className={classes.menu_trigger_wrapper}>
          <div
            ref={iconRef}
            className={classes.menu_trigger}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <LanguageIcon color={iconConfig.color} width={iconConfig.width} height={iconConfig.height} />
          </div>

          <div ref={dropdownRef}>
            <LanguageDropdown
              isDropdownOpen={isDropdownOpen}
              closeDropdown={() => setIsDropdownOpen(false)}
              setIsDropdownOpen={setIsDropdownOpen}
            />
          </div>
        </div>
      </div>

      <div className={classes.ripple} ref={rippleRef}></div>
    </>
  );
};

export default ThemeLanguageNav;
