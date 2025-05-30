import React from "react"
import { useContext, useState } from "react";
import classes from "./ProfileNavigation.module.scss"
import { useTranslation } from "react-i18next";
import icons  from '../../../../assets/nav_ic/Icons'
import { Link } from "react-router-dom";
import { AuthContext } from "../../../AuthProvider";


const ProfileNavigation = () => {

  const { t } = useTranslation();

  const { isAuthorized} = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

  const profileMenu = [
    { label: t("Profile"), to: "/profile", icon: <icons.ProfileIcon width="32px" height="32px" color="var(--light-text-color)"/> },
    { label: t("Dashboard"), to: "/dashboard", icon: <icons.DashboardIcon width="32px" height="32px" color="var(--light-text-color)"/>},
    { label: t("Orders"), to: "/orders", icon: <icons.OrdersIcon width="32px" height="32px" color="var(--light-text-color)"/> },
    { label: t("Account"), to: "/account", icon: <icons.AccountIcon width="32px" height="32px" color="var(--light-text-color)"/> },
    { label: t("Support"), to: "/support", icon: <icons.SupportIcon width="32px" height="32px" color="var(--light-text-color)"/> },
    { label: t("Log out"), to: "/logout", icon: <icons.LogoutIcon width="32px" height="32px" color="var(--light-text-color)"/> },
  ];

  if (!isAuthorized) {
    return (
      <div className={classes.auth_buttons}>
        <Link to="/login">{t("Sign in")}</Link>
        <Link to="/register">{t("Sign up")}</Link>
      </div>
    ) 
  }


  return (
    <div className={classes.profile_container}>
      <div onClick={handleToggleDropdown} className={classes.profile_trigger}>
        username
      </div>

      {isDropdownOpen && (
        <div className={`${classes.profile_dropdown} ${isDropdownOpen ? classes.activity : classes.inactive}`}>
          {profileMenu.map((item) => (
            <Link key={item.label} to={item.to} className={classes.profile_link}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfileNavigation;