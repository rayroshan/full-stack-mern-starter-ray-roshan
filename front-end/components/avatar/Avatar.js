import React, { useState } from "react";
import classes from "./Avatar.module.scss";

const Avatar = (props) => {
  const { image, firstname, lastname } = props;

  return (
    <div
      className={classes.avatar}
      style={image ? { backgroundImage: `url('${image}')` } : {}}
    >
      <span className={classes.avatar__initials}>
        {(!image || image == undefined || image == "undefined") && (
          <>
            {firstname ? firstname.substring(0, 1).toUpperCase() : ""}
            {lastname ? lastname.substring(0, 1).toUpperCase() : ""}
          </>
        )}
      </span>
    </div>
  );
};

export default Avatar;
