import React, { useState } from "react";
import classes from "./Text.module.scss";

const Text = (props) => {
  const {
    name,
    label,
    type,
    placeholder,
    error,
    message,
    value,
    inputHandler,
    blurHandler,
    submitFunction,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={classes.text}>
      {label && (
        <label className={classes.label} htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={name}
        className={classes.text__input}
        name={name}
        onBlur={blurHandler}
        onChange={inputHandler}
        onKeyDown={submitFunction ? submitFunction : () => {}}
        placeholder={placeholder}
        type={type == "password" && showPassword ? "text" : type}
        value={value}
      />
      {type == "password" && (
        <div
          onClick={() => setShowPassword(!showPassword)}
          className={
            label
              ? [classes.text__icon__label, classes.text__icon].join(" ")
              : classes.text__icon
          }
        >
          <i className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"}></i>
        </div>
      )}

      {error && (
        <p className={[classes.note, classes.note__error].join(" ")}>{error}</p>
      )}
      {message && (
        <p className={[classes.note, classes.note__message].join(" ")}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Text;
