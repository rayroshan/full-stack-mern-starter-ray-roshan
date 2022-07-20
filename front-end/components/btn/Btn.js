import React from "react";
import { Spinner } from "reactstrap";
import classes from "./Btn.module.scss";

const Btn = (props) => {
  const { children, type, disabled, block, className, onClick, loading } =
    props;

  const renderBtnStyles = () => {
    let styles = [classes.btn];

    if (className) {
      styles.push(className);
    }

    if (block) {
      styles.push(classes.btn__block);
    }

    if (disabled) {
      styles.push(classes.btn__disabled);
    } else {
      switch (type) {
        case "secondary":
          styles.push(classes.btn__secondary);
          break;
        case "primary":
          styles.push(classes.btn__primary);
          break;
        default:
          styles.push(classes.btn__primary);
      }
    }
    return styles.join(" ");
  };

  return (
    <button
      type="button"
      className={renderBtnStyles()}
      onClick={onClick ? onClick : () => {}}
      data-testid="button"
    >
      {children}
      {loading && <Spinner className="spinner" size="sm" />}
    </button>
  );
};

export default Btn;
