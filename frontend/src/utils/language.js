import i18n from "i18next";

export const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  }