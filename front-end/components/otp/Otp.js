import React, { useState, useContext, useEffect, useRef } from "react";
import classes from "./Otp.module.scss";

const Otp = (props) => {
  const { maxLength, value, changeHandler, handlePinReady } = props;
  const [code, setCode] = useState("");
  const [isInputContainerFocused, setIsInputContainerFocused] = useState(false);
  const inputRef = useRef(null);
  const arrayOfDigits = Array(maxLength).fill(0);

  useEffect(() => {
    if (value) {
      setCode(value);
    } else {
      setCode("");
    }
  }, [value]);

  useEffect(() => {
    handlePinReady(maxLength === code?.length);
    return () => handlePinReady(false);
  }, [code]);

  const onDigitClick = () => {
    setIsInputContainerFocused(true);
    inputRef?.current?.focus();
  };

  const handleBlur = () => {
    setIsInputContainerFocused(false);
  };

  const handleInputChange = (e) => {
    if (e?.target?.value?.length <= maxLength) {
      changeHandler(e);
    }
  };

  const toCodeDigitInput = (_value, index) => {
    const emptyInputCharacter = " ";
    const digit = code[index] || emptyInputCharacter;
    const isCurrentDigit = index === code.length;
    const isLastDigit = index === maxLength - 1;
    const isCodeFull = code.length === maxLength;
    const isDigitFocused =
      isInputContainerFocused &&
      (isCurrentDigit || (isLastDigit && isCodeFull));

    return (
      <div
        className={
          isDigitFocused
            ? [classes.otp__digits, classes.otp__digits__focused].join(" ")
            : classes.otp__digits
        }
        key={index}
        onClick={onDigitClick}
      >
        {digit ? digit : "-"}
      </div>
    );
  };

  return (
    <div>
      <div className={classes.otp}>{arrayOfDigits.map(toCodeDigitInput)}</div>
      <input
        className={classes.otp__text}
        type="number"
        maxLength={maxLength}
        value={value}
        onChange={handleInputChange}
        ref={inputRef}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default Otp;
