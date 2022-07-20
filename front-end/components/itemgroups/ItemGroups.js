import React from "react";
import classes from "./ItemGroups.module.scss";

const ItemGroups = (props) => {
  const { children } = props;

  return <div className={classes.itemgroups}>{children}</div>;
};

export default ItemGroups;
