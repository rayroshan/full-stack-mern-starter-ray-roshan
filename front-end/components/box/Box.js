import React from "react";
import classes from "./Box.module.scss";

const Box = (props) => {
  const { children, title, icon, iconClickHandler } = props;

  return (
    <div className={classes.box}>
      {icon && (
        <span onClick={iconClickHandler} className={classes.box__icon}>
          <i className={icon}></i>
        </span>
      )}
      <div className={classes.box__content}>
        {title && <h1>{title}</h1>}
        {children}
      </div>
    </div>
  );
};

export default Box;
