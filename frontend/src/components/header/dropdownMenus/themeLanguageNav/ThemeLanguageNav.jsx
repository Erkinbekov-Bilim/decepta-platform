import React from "react"
import classes from './ThemeLanguageNav.module.scss'
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { flags } from '../../../../assets/flags/flags'
import { Link } from "react-router-dom";
import icons from '../../../../assets/nav_ic/Icons'

const {
  LightThemeIcon,
  NightThemeIcon,
  LanguageIcon,
  ProfileIcon,
  LogoutIcon
} = icons

const languages = [
  { code: "en", name: "English", flag: flags.united_states},
  { code: "ru", name: "Русский", flag: flags.russian_flag},
  { code: "zh", name: "中文", flag: flags.chinese_flag},
]

const ThemeLanguageNav = () => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { t } = useTranslation();

  const [theme, setTheme] = useState("light");


  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
  }



  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  }


  return (
    <div>
      <div className={classes.menu_container}>
        <div className={classes.menu_trigger} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <LanguageIcon width="32px" height="32px" color="var(--light-btn-primary-bg)"/>
        </div>

        <div className={`${classes.menu_dropdown} ${isDropdownOpen ? classes.active : classes.inactive}`}>

          <div className={classes.menu_dropdown_content}>
            <ul>

              {languages.map((language) => (
                <li key={language.code}>
                  <button onClick={() => handleLanguageChange(language.code)}>
                    <div className={classes.language_option}>
                      <img src={language.flag} alt={language.name} />
                      <span>{language.name}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeLanguageNav;