import React, { useEffect } from "react"
import { LANGUAGES_OPTIONS as languagesConstant } from "../../../../../constants";
import { handleLanguageChange } from "../../../../../utils/language"
import classes from "./LanguageDropdown.module.scss"


const LanguageDropdown = ({style = {}, isDropdownOpen, closeDropdown}) => {

  return (
  <div
    className={`${classes.menu_dropdown} ${isDropdownOpen ? classes.active : classes.inactive}`}
    style={style}>
    <div className={classes.menu_dropdown_content}>
      <ul>
        {languagesConstant.map((language) => (
          <li key={language.code}>
            <button onClick={() => {handleLanguageChange(language.code); closeDropdown()}}>
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
  )
}


export default LanguageDropdown;