import React, { useEffect, useState } from "react";
import Container from "../../container/Container";
import classes from "./WhyChooseUsSlider.module.scss";
import { useTranslation } from "react-i18next";
import whyChooseData from "./WhyChooseUsData";
import { SLIDE_INTERVAL } from "../../../constants";
import BtnSlider from "./btnSlider/BtnSlider";


const WhyChooseUs = () => {
  const { t } = useTranslation();

  const iconProps = {
    width: "42px",
    height: "42px",
    color: "var(--light-primary-color)",
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = whyChooseData.length;
  const currentItem = whyChooseData[currentIndex];
  const Icon = currentItem.icon;


  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, SLIDE_INTERVAL);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
  };

  return (
    <Container>
      <div className={classes.why_choose_us}>
        <p className={classes.why_choose_us_title}>{t("Why Choose Us?")}</p>
        <div className={classes.slider_container}>
          <div className={classes.slider_item}>
            <div className={classes.slider_icon}>
              <Icon {...iconProps} />
            </div>
            <p className={classes.slider_title}>{t(currentItem.titleKey)}</p>
            <ul className={classes.slider_list}>
              {currentItem.subItems.map((sub, index) => (
                <li key={sub.number} className={classes.slider_list_item}>
                  <div className={classes.slider_number}>{sub.number}</div>
                  <span className={classes.slider_list_text}>{t(sub.titleKey)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={classes.slider_controls}>
          <div className={classes.slider_btn_left}>
            <BtnSlider moveSlide={handlePrev} direction="prev" />
          </div>
          <div className={classes.slider_btn_right}>
            <BtnSlider moveSlide={handleNext} direction="next" />
          </div>
        </div>
        <div className={classes.nav_dots}>
          {whyChooseData.map((_, index) => (
            <div key={index} className={`${classes.dot} ${index === currentIndex ? classes.active : ""}`} onClick={() => setCurrentIndex(index)}>

            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default WhyChooseUs;
