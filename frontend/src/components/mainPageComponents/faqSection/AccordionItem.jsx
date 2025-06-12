import React, { useState, useRef, useEffect } from "react";
import classes from "./Faq.module.scss";
import { useTranslation } from "react-i18next";
import icons from "../../../assets/icons/icons";


const { PlusIcon, MinusIcon } = icons

const AccordionItem = ({ index, question, answer, isOpen, onClick }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");
  const { t } = useTranslation();


  const iconProps = {
    width: "24px",
    height: "24px",
    color: "var(--light-primary-color)",
  };

  useEffect(() => {
    if (isOpen) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <div
      className={`${classes.faq_item} ${isOpen ? classes.faq_item_open : ""}`}
    >
      <div className={classes.faq_question} onClick={onClick}>
        <p className={classes.faq_number}>{index + 1}</p>
        <span className={classes.faq_question_text}>{t(question)}</span>
        <span className={classes.faq_icon}>{isOpen ? <MinusIcon {...iconProps} /> : <PlusIcon {...iconProps} />}</span>
      </div>

      <div
        ref={contentRef}
        className={classes.faq_answer_wrapper}
        style={{ maxHeight: height }}
      >
        <p className={classes.faq_answer}>{t(answer)}</p>
      </div>
    </div>
  );
};

export default AccordionItem;