import React from "react";
import classes from "./Header.module.scss";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo_decepta_crypto.svg";
import "../../styles/_variables.scss";
import MainNavigation from "./dropdownMenus/mainNavigation/MainNavigation";
import ThemeLanguageNav from "./dropdownMenus/themeLanguageNav/ThemeLanguageNav";
import ProfileNavigation from "./dropdownMenus/profileNavigation/ProfileNavigation";

const Header = () => {
  return (
    <header className={classes.header}>
      <nav className={classes.nav}>
        <div className={classes.nav_container}>
          <Link to="/" className={classes.logo}>
            <img
              src={logo}
              alt="decepta_logotype"
              className={classes.logo_img}
            />
          </Link>

          <MainNavigation/>
          <ThemeLanguageNav/>
          <ProfileNavigation/>

        </div>
      </nav>
    </header>
  );
};

export default Header;
