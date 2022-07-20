import * as Yup from "yup";
import BaseLayout from "@/components/layout/BaseLayout";
import BasePage from "@/components/layout/BasePage";
import Button from "@/components/btn/Btn";
import Error from "@/components/error/Error";
import Link from "next/link";
import Notes from "@/components/notes/Notes";
import React, { useState, useEffect, useContext, useRef } from "react";
import Text from "@/components/text/Text";
import axios from "axios";
import { AuthContext } from "@/shared/context/auth-context";
import { Container, Row, Col } from "reactstrap";
import { Formik } from "formik";
import { useRouter } from "next/router";

const validationSchema = Yup.object({
  newPassword: Yup.string()
    .trim()
    .min(8, "Password is too short")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .trim()
    .min(8, "Password confirmation is too short")
    .required("Password confirmation is required"),
});

const Recover = () => {
  const router = useRouter();
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const auth = useContext(AuthContext);

  const resetInfo = {
    newPassword: "",
    confirmPassword: "",
  };

  useEffect(() => {
    if (auth.isLoggedIn) {
      if (
        auth.startPage &&
        auth.startPage.indexOf("auth") == -1 &&
        auth.startPage != "/"
      ) {
        router.push(auth.startPage);
      } else {
        router.push("/");
      }
    }
  }, [loading, auth]);

  const handleChangePassword = (values) => {
    setLoading(true);

    let options = {
      method: "POST",
      url: `${process.env.BASE_URL}/api/auth/validate`,
      params: {
        uniqueId: router?.query?.id,
      },
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        newPassword: values?.newPassword,
        confirmPassword: values?.confirmPassword,
      }),
    };

    const postValidate = async () => {
      try {
        const response = await axios.request(options);
        const data = response.data;

        setUpdated(true);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setMessage({
          text:
            err.response?.data?.message ||
            err?.message ||
            "Something went wrong",
          error: true,
        });
      }
    };
    postValidate();
  };

  return (
    <BaseLayout>
      <BasePage>
        <Container>
          <Row>
            <Col sm={{ size: 6, offset: 3 }}>
              {!updated ? (
                <Formik
                  initialValues={resetInfo}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    handleChangePassword(values);
                  }}
                >
                  {({
                    values,
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                  }) => {
                    const { newPassword, confirmPassword } = values;
                    return (
                      <div className="margin-top-100">
                        <h1 className="margin-bottom-15">
                          Reset your password
                        </h1>

                        <Text
                          type="password"
                          name="newPassword"
                          placeholder="New Password"
                          label="New Password"
                          error={errors.newPassword}
                          onBlur={handleBlur("newPassword")}
                          inputHandler={handleChange("newPassword")}
                          disabled={loading}
                          value={newPassword}
                        />

                        <Text
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          label="Confirm Password"
                          error={errors.confirmPassword}
                          onBlur={handleBlur("confirmPassword")}
                          inputHandler={handleChange("confirmPassword")}
                          disabled={loading}
                          value={confirmPassword}
                        />

                        <Button
                          onClick={handleSubmit}
                          className="margin-top-10"
                          block
                          loading={loading}
                        >
                          Reset Password
                        </Button>

                        <Notes>
                          <div>
                            <p>Already have an account?</p>
                            <span>
                              <Link as="/auth/signin" href="/auth/signin">
                                Sign in
                              </Link>
                            </span>
                          </div>
                          <div>
                            <p>Don't have an account?</p>
                            <span>
                              <Link as="/auth/signup" href="/auth/signup">
                                Sign up
                              </Link>
                            </span>
                          </div>
                        </Notes>
                        <Error error={message} setError={setMessage} />
                      </div>
                    );
                  }}
                </Formik>
              ) : (
                <div className="margin-top-100 margin-bottom-50 text-center">
                  <h1 className="margin-bottom-15">
                    Your password is now updated
                  </h1>

                  <Notes>
                    <div>
                      <p>You can now sign in</p>
                      <span>
                        <Link as="/auth/signin" href="/auth/signin">
                          Sign in
                        </Link>
                      </span>
                    </div>
                  </Notes>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </BasePage>
    </BaseLayout>
  );
};

export default Recover;
