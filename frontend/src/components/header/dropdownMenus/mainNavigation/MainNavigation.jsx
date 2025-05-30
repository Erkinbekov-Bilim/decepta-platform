import React from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../../../../styles/_variables.scss";
import classes from "./MainNavigation.module.scss";
import icons from "../../../../assets/nav_ic/Icons"


const MainNavigation = () => {

  const [openDropdown, setOpenDropdown] = useState(null);
  const { t } = useTranslation();

  const handleMouseEnter = (label) => {
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };


  const mainLinks = [
    { label: t("Buy"), to: "/buy"},
    { label: t("Markets"), to: "/markets" },
    {
      label: t("Trade"),
      submenu: [
        { label: t("Spot"), to: "/trade/spot", icon: <icons.SpotStarIcon color="var(--light-text-color)" width="3px" height="32px"/> },
        { label: t("P2P"), to: "/trade/p2p", icon: <icons.P2PIcon color="var(--light-text-color)" width="32px" height="32px"/> },
        { label: t("Convert"), to: "/trade/convert", icon: <icons.ConvertIcon color="var(--light-text-color)" width="32px" height="32px"/> },
      ],
    },
    { label: t("Earn"), to: "/earn" },
    { label: t("Wallet"), to: "/wallet" },
    {
      label: t("More"),
      submenu: [
        { label: t("News"), to: "/news", icon: <icons.NewsIcon color="var(--light-text-color)" width="32px" height="32px"/> },
        { label: t("About Us"), to: "/about", icon: <icons.AboutUsIcon color="var(--light-text-color)" width="32px" height="32px"/> },
      ],
    },
  ];

  return (
    <>
      <div className={classes.nav_links}>
        {mainLinks.map((mainLink, index) => (
          <NavLink to={mainLink.to} key={index} className={classes.nav_link}>
            <div
              key={index}
              className={classes.nav_link_item}
              onMouseEnter={() => handleMouseEnter(mainLink.label)}
              onMouseLeave={handleMouseLeave}
            >
              {mainLink.label}
            </div>
          </NavLink>
        ))}
      </div>
    </>
  )
}

export default  MainNavigation;