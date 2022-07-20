import React from "react";
import classes from "./ItemChild.module.scss";

const ItemChild = (props) => {
  const { children, bold } = props;

  const renderStyles = () => {
    let styles = [classes.itemchild];

    if (bold) {
      styles.push(classes.itemchild__bold);
    }

    return styles.join(" ");
  };

  return <div className={renderStyles()}>{children}</div>;
};

export default ItemChild;
