import React, { useState, useEffect } from "react";
import { Alert } from "reactstrap";

const Error = (props) => {
  const { error, setError, callback } = props;

  useEffect(() => {
    let time;
    if (error?.text) {
      time = error.error ? 3000 : 3000;

      const timer = setTimeout(() => {
        setError({
          text: null,
          link: null,
          error: null,
        });

        if (callback) {
          callback();
        }
      }, time);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return error?.text ? (
    <Alert
      color={error.error ? "danger" : "success"}
      className="margin-top-10 margin-bottom-0 text-center"
    >
      {error.text}
    </Alert>
  ) : (
    <></>
  );
};

export default Error;
