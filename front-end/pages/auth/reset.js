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
  email: Yup.string()
    .email("Please provide a valid email")
    .required("Email is required"),
});

const Reset = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const [resetRequested, setResetRequested] = useState(false);
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [resetInfo, setResetInfo] = useState({
    email: "",
  });

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

  const resetPassword = (values) => {
    setLoading(true);
    const { email } = values;

    let options = {
      method: "POST",
      url: `${process.env.BASE_URL}/api/auth/resetPassword`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        email,
      }),
    };

    const postReset = async () => {
      try {
        const response = await axios.request(options);

        setResetRequested(true);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setResetRequested(false);
        setMessage({
          text:
            err.response?.data?.message ||
            err?.message ||
            "Something went wrong",
          error: true,
        });
      }
    };
    postReset();
  };

  return (
    <BaseLayout>
      <BasePage>
        <Container>
          <Row>
            <Col sm={{ size: 6, offset: 3 }}>
              {!resetRequested ? (
                <Formik
                  validateOnChange={false}
                  initialValues={resetInfo}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    resetPassword(values);
                  }}
                >
                  {({
                    values,
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                  }) => {
                    const { email } = values;

                    return (
                      <div className="margin-top-100">
                        <h1 className="margin-bottom-15">Reset Password</h1>
                        <Text
                          type="email"
                          name="email"
                          placeholder="Work Email"
                          label="Email Address"
                          error={errors.email}
                          onBlur={handleBlur("email")}
                          inputHandler={handleChange("email")}
                          disabled={loading}
                          value={email}
                        />
                        <Button
                          className="margin-top-10"
                          block
                          onClick={handleSubmit}
                        >
                          Reset Password
                        </Button>
                        <Error error={message} setError={setMessage} />
                        <Notes>
                          <div>
                            <p>Remember your password?</p>
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
                      </div>
                    );
                  }}
                </Formik>
              ) : (
                <div className="margin-top-100 margin-bottom-50 text-center">
                  <h1 className="margin-bottom-15">
                    Check your email to reset your password
                  </h1>
                  <Notes>
                    <div>
                      <p>Remember your password?</p>
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
              )}
            </Col>
          </Row>
        </Container>
      </BasePage>
    </BaseLayout>
  );
};

export default Reset;
