import React from "react"
import api from "../../api";
import classes from "./ManPage.module.scss";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { useTranslation, Trans } from "react-i18next";
import Container from "../../components/container/Container";
import MainCryptoCard from "../../components/mainCryptoCard/MainCryptoCard";
import WhyChooseUsSlider from "../../components/mainPageComponents/whyChooseUs/WhyChooseUsSlider";
import HowItWorksSection from "../../components/mainPageComponents/howItWorks/HowItWorksSection";
import Faq from "../../components/mainPageComponents/faqSection/Faq";

const MainPage = () => {

  const { isAuthenticated } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <Container>
      <main className={classes.main}>
        <section className={classes.main_section}>
          <div className={classes.main_container}>
            <div className={classes.main_info}>
            {!isAuthenticated ? (
              <>
                <p className={classes.main_text}>
                  <Trans i18nKey="mainPage.info_text">
                    Trade cryptocurrency quickly, <span className={classes.main_bold}>safely</span> and <span className={classes.main_bold}>conveniently!</span>
                  </Trans>
                </p>
                <Link to="/signup" className={classes.main_button}>{t("Try Decepta")}</Link>
              </>
            ) : (
              <>
                <p className={classes.main_text}>
                  <Trans i18nKey="mainPage.after_login">
                    To continue trading, <span className={classes.main_bold}>please confirm your phone number</span>
                  </Trans>
                </p>
                <Link to={"/verified"} className={classes.main_button}>{t("Verify Now")}</Link>
              </>
            )}
            </div>
          </div>
          <MainCryptoCard/>
        </section>
        
        <section className={classes.why_choose_us}>
          <WhyChooseUsSlider/>
        </section>
        <section>
          <HowItWorksSection/>
        </section>
        <section>
          <Faq/>
        </section>
      </main>
    </Container>
  );
};

export default MainPage;
