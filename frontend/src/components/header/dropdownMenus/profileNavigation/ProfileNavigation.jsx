import React, { useEffect } from "react"
import { useContext, useState } from "react";
import classes from "./ProfileNavigation.module.scss"
import { useTranslation } from "react-i18next";
import nav_icons  from '../../../../assets/nav_icons/nav_Icons'
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../../../../context/AuthContext';
import { useIconConfig } from "../../../../context/IconConfigContext";

const {
  ProfileIcon,
  DashboardIcon,
  OrdersIcon,
  AccountIcon,
  SupportIcon,
  LogoutIcon,
  ArrowRightIcon
} = nav_icons

const ic_custom = {
  width: "26px",
  height: "26px",
}

const ProfileNavigation = () => {

  

  const { t } = useTranslation();
  const { isAuthenticated, userProfile, logout, isLoading } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(false);

    


  const profileMenu = [
    { label: t("Profile"), to: "/profile", icon: <ProfileIcon width={ic_custom.width} height={ic_custom.height}/> },
    { label: t("Dashboard"), to: "/dashboard", icon: <DashboardIcon width={ic_custom.width} height={ic_custom.height}/>},
    { label: t("Orders"), to: "/orders", icon: <OrdersIcon width={ic_custom.width} height={ic_custom.height}/> },
    { label: t("Account"), to: "/account", icon: <AccountIcon width={ic_custom.width} height={ic_custom.height}/> },
    { label: t("Support"), to: "/support", icon: <SupportIcon width={ic_custom.width} height={ic_custom.height}/> },
    { label: t("Log out"), to: "/logout", icon: <LogoutIcon width={ic_custom.width} height={ic_custom.height}/> },
  ];

  if (!isAuthenticated) {
    return (
      <div className={classes.menu_container}>
        <div className={classes.menu_auth_buttons}>
          <Link to="/login">{t("Log in")}</Link>
          <Link to="/signup">{t("Sign up")}</Link>
        </div>
      </div>
    ) 
  }

  if (isLoading) {
    return null;
  }

  return (  
      <>
        <div className={classes.menu_container}>
          <div className={classes.menu_trigger} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className={classes.menu_icon}>
              <ProfileIcon width="32px" height="32px" color="var(--light-text-color)" />
              <div className={classes.menu_badge}>
                <p className={classes.menu_badge_name}>{userProfile?.profile?.nickname}</p>
                <p className={classes.menu_badge_nickname}>{userProfile?.profile?.tag_nickname}</p>
              </div>
            </div>
          </div>
          <div className={`${classes.menu_dropdown} ${isDropdownOpen ? classes.active : classes.inactive}`}>
            <div className={classes.menu_dropdown_content}>
              <ul>
                {profileMenu.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className={classes.menu_dropdown_link} onClick={item.onClick} onMouseEnter={() => setHoveredIndex(item.label)} onMouseLeave={() => setHoveredIndex(null)} replace>
                      <div className={classes.menu_dropdown_item}>
                        {item.icon}
                        <p>{item.label}</p>
                      </div>
                      {hoveredIndex === item.label && (
                        <ArrowRightIcon width="16px" height="16px" color="var(--light-text-color)" className={classes.menu_dropdown_arrow}/>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
}

export default ProfileNavigation;