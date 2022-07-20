import React from "react";
import classes from "./Toggle.module.scss";
import Switch from "react-switch";

const Toggle = (props) => {
  const {
    changeHandler,
    checked,
    label,
    style,
    width,
    height,
    handleDiameter,
    disabled,
    sm,
  } = props;

  return (
    <div
      className={
        sm ? [classes.toggle, classes.toggle__sm].join(" ") : classes.toggle
      }
      style={style}
    >
      {label && (
        <span
          className={
            sm
              ? [classes.toggle__label, classes.toggle__label__sm].join(" ")
              : classes.toggle__label
          }
        >
          {" "}
          {label}{" "}
        </span>
      )}
      <Switch
        onChange={changeHandler}
        onColor="#FED501"
        checked={checked}
        uncheckedIcon={false}
        checkedIcon={false}
        width={width ? width : 50}
        height={height ? height : 25}
        handleDiameter={handleDiameter ? handleDiameter : 21}
        disabled={disabled}
      />
    </div>
  );
};

export default Toggle;
