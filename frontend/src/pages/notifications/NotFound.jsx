import React, { useState, useEffect} from "react"
import classes from "./NotFound.module.scss"
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import nav_icons from '../../assets/nav_icons/nav_Icons'
import icons from '../../assets/icons/icons'
import Container from "../../components/container/Container"


const { ArrowRightIcon } = nav_icons
const { LightSadSmileIcon, DarkSadSmileIcon } = icons

const NotFound = () => {

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const { t } = useTranslation();
  const page_information = {
    code: 404,
    title: t("Oops! Page not found"),
    description: t("We couldn't find the page you're looking for. It might have been moved or doesn't exist anymore"),
    back_to_homepage: t("Back to homepage")
  }


  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      setTheme(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={classes.error_container}>
      <div>
        {theme === "light" ? (
          <LightSadSmileIcon width={"100px"} height={"100px"} />
        ) : (
          <DarkSadSmileIcon width={"100px"} height={"100px"} />
        )}
      </div>
      <p className={classes.error_code}>{page_information.code}</p>
      <p className={classes.error_title}>{page_information.title}</p>
      <p className={classes.error_description}>{page_information.description}</p>
      <Link to = "/" className={classes.error_button} 
      >{page_information.back_to_homepage} <ArrowRightIcon width={"20px"} height={"20px"}/></Link>
    </div>
  )
}

export default NotFound