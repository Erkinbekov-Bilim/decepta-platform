import React, { useEffect, useState } from "react";
import classes from "./Header.module.scss";
import { Link } from "react-router-dom";
import light_logo from "../../assets/images/logo_decepta_crypto.svg";
import dark_logo from "../../assets/images/logo_decepta_crypto_dark.svg";
import MainNavigation from "./dropdownMenus/mainNavigation/MainNavigation";
import ThemeLanguageNav from "./dropdownMenus/themeLanguageNav/ThemeLanguageNav";
import ProfileNavigation from "./dropdownMenus/profileNavigation/ProfileNavigation";
import Container from "../container/Container"

const Header = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(currentTheme);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  return (
    <Container>
      <header className={classes.header}>
        <nav className={classes.nav}>
          <div className={classes.nav_container}>
            <Link to="/" className={classes.logo}>
              <img
                src={theme === 'light' ? light_logo : dark_logo}
                alt="decepta_logotype"
                className={classes.logo_img}
              />
            </Link>

            <MainNavigation />
            <ThemeLanguageNav />
            <ProfileNavigation />
          </div>
        </nav>
      </header>
    </Container>
  );
};

export default Header;
