import React, { useState, useRef, useEffect } from "react";
import faqData from "./FaqData";
import classes from "./FAQ.module.scss";
import { useTranslation } from "react-i18next";
import AccordionItem from "./AccordionItem";
import "../../../styles/_variables.scss";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useTranslation();

  const toggleIndex = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={classes.faq}>
      <p className={classes.faq_title}>{t("Frequently Asked Questions")}</p>
      <div className={classes.faq_items}>
        {faqData.map((item, index) => (
          <AccordionItem
            key={index}
            index={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onClick={() => toggleIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Faq;
