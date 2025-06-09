import React from "react"
import Container from "../../container/Container"
import classes from "./WhyChooseUsSlider.module.scss"
import { useTranslation } from "react-i18next";


const WhyChooseUs = () => {

  const { t } = useTranslation();

  return (
    <Container>
      <>
        <div>
          <p>{t("Why choose us?")}</p>
        </div>
      </>
    </Container>
  )
}

export default WhyChooseUs;