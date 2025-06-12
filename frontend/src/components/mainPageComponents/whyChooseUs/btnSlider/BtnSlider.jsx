import React from 'react'
import classes from "./BtnSlider.module.scss"
import icons from '../../../../assets/icons/icons'
import '../../../../styles/_variables.scss'

const {
  RightArrowIcon,
  LeftArrowIcon
} = icons

const BtnSlider = ({moveSlide, direction}) => {
  return (
    <button className={classes.btn_slider} onClick={moveSlide}>
      {direction === "next" ? <RightArrowIcon /> : <LeftArrowIcon />}
    </button>
  )
}

export default BtnSlider