import React from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../../../../styles/_variables.scss";
import classes from "./MainNavigation.module.scss";
import icons from "../../../../assets/nav_icons/nav_Icons"

const {
  SpotStarIcon,
  P2PIcon,
  ConvertIcon,
  NewsIcon,
  AboutUsIcon,
  ArrowRightIcon
} = icons


const MainNavigation = () => {

  const [openDropdown, setOpenDropdown] = useState(null);
  const [closeTimer, setCloseTimer] = useState(null);
  const { t } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState(false);

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      setOpenDropdown(null);
    }, 50);
    setCloseTimer(timer);
  };

  const handleMouseEnter = (label) => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      setCloseTimer(null);
    }
    setOpenDropdown(label);
};

  const mainLinks = [
    { label: t("Buy"), to: "/buy"},
    { label: t("Markets"), to: "/markets" },
    {
      label: t("Trade"),
      submenu: [
        { label: t("Spot"), description: t("Buy and sell on the Spot market with advanced tools") ,to: "/trade/spot", icon: <SpotStarIcon width="32px" height="32px" className={classes.icon}/> },
        { label: t("P2P"), description: t("Buy & sell cryptocurrencies using bank transfer and 800+ options") ,to: "/trade/p2p", icon: <P2PIcon width="32px" height="32px" className={classes.icon}/>},
        { label: t("Convert"), description: t("The easiest way to trade at all sizes") , to: "/trade/convert", icon: <ConvertIcon width="32px" height="32px" className={classes.icon}/> },
      ],
    },
    { label: t("Earn"), to: "/earn" },
    { label: t("Wallet"), to: "/wallet" },
    {
      label: t("More"),
      submenu: [
        { label: t("News"), description: t("Latest news and updates from the world of cryptocurrencies") ,to: "/news", icon: <NewsIcon width="32px" height="32px" className={classes.icon}/> },
        { label: t("About Us"), description: t("Information about our company, team and values") ,to: "/about", icon: <AboutUsIcon width="32px" height="32px" className={classes.icon}/> },
      ],
    },
  ];

  return (
    <>
      <div className={classes.nav_links}>
        {mainLinks.map((mainLink, index) => {
          const hasSubmenu = !!mainLink.submenu

          return (
            <div
              key={index}
              className={classes.nav_link_wrapper}
              onMouseEnter={() => handleMouseEnter(mainLink.label)}
              onMouseLeave={handleMouseLeave}
            >
              <div className={classes.nav_link_item_wrapper}>
                {hasSubmenu ? (
                  <div className={classes.nav_link_item}>
                    {mainLink.label}
                  </div>
                ) : (
                  <NavLink to={mainLink.to} className={classes.nav_link_item} replace>
                    {mainLink.label}
                  </NavLink>
                )}

                {hasSubmenu && openDropdown === mainLink.label && (
                  <div className={classes.submenu_dropdown}>
                    {mainLink.submenu.map((item, subIndex) => (
                      <NavLink to={item.to} className={classes.submenu_dropdown_item} key={subIndex} onMouseEnter={() => setHoveredIndex(subIndex)} onMouseLeave={() => setHoveredIndex(null)} replace>
                        {item.icon}
                        <div className={classes.submenu_dropdown_item_text}>
                          <p className={classes.submenu_dropdown_item_text_label}>{item.label}</p>
                          <p className={classes.submenu_dropdown_item_text_description}>{item.description}</p>
                        </div>
                        {hoveredIndex === subIndex && (
                          <ArrowRightIcon width="16px" height="16px" color="var(--light-text-color)" className={classes.submenu_dropdown_item_arrow}/>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default  MainNavigation;