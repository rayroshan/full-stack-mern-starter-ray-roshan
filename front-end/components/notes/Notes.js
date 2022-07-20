import React from "react";
import classes from "./Notes.module.scss";

const Notes = (props) => {
  const { children } = props;

  return <div className={classes.notes}>{children}</div>;
};

export default Notes;
