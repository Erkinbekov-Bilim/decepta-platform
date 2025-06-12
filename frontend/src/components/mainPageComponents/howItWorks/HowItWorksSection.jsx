import React, { useContext}  from "react";
import classes from "./HowItWorksSection.module.scss";
import { useTranslation } from "react-i18next";
import '../../../styles/_variables.scss';
import { Link } from "react-router-dom";
import howItWorksData from "./HowItWorksData"
import "../../../styles/_variables.scss";
import { AuthContext } from '../../../context/AuthContext';


const HowItWorksSection = () => {

  const { t } = useTranslation();
  const { isAuthenticated } = useContext(AuthContext);

  const iconProps = {
    width: "80px",
    height: "80px",
    color: "var(--light-primary-color)",
  };

  return (
    <div className={classes.how_it_works}>
      <p className={classes.how_it_works_title}>{t("How it Works?")}</p>
      <div className={classes.how_it_works_steps}>
        {howItWorksData.map((step, index) => {
          const Icon = step.icon;
          const translatedText = t(step.link_text);
          const isCreateAccount = step.link_text === "how.create_account.link_text";
          const isDone = isCreateAccount && isAuthenticated;
          return (
            <div key={index} className={`${isDone ? classes.how_it_works_step_done : classes.how_it_works_step}`}>
              <div className={`${isDone ? classes.how_it_works_step_number_done : classes.how_it_works_step_number}`}>
                {index + 1}
              </div>
              <Icon {...iconProps} />
              <p className={classes.how_it_works_step_title}>{t(step.titleKey)}</p>
              <p className={classes.how_it_works_step_description}>{t(step.descriptionKey)}</p>
              <Link to={step.link} className={`${isDone ? classes.how_it_works_step_link_done : classes.how_it_works_step_link}`}>
                {isCreateAccount && isAuthenticated ? t("You did it!") : translatedText}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default HowItWorksSection;