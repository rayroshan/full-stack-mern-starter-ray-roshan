import * as Yup from "yup";
import BaseLayout from "@/components/layout/BaseLayout";
import BasePage from "@/components/layout/BasePage";
import Button from "@/components/btn/Btn";
import Error from "@/components/error/Error";
import Link from "next/link";
import Notes from "@/components/notes/Notes";
import Otp from "@/components/otp/Otp";
import React, { useState, useEffect, useContext, useRef } from "react";
import Text from "@/components/text/Text";
import axios from "axios";
import { AuthContext } from "@/shared/context/auth-context";
import { Container, Row, Col } from "reactstrap";
import { Formik } from "formik";
import { useRouter } from "next/router";

const validationSchema = Yup.object({
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(
      /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/i,
      "Please enter a valid phone number"
    ),
  password: Yup.string()
    .trim()
    .min(8, "Password is too short")
    .required("Password is required"),
});

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const [isPinReady, setIsPinReady] = useState(false);
  const [verificationPin, setVerificationPin] = useState();
  const [showVerification, setShowVerification] = useState(false);
  const [message, setMessage] = useState();
  const [showLogin, setShowLogin] = useState(false);
  const auth = useContext(AuthContext);
  const [verificationPhoneNumber, setVerificationPhoneNumber] = useState("");
  const router = useRouter();
  const [loginInfo, setLoginInfo] = useState({
    phoneNumber: "",
    password: "",
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

  const signin = async (values) => {
    setLoading(true);

    const { password, phoneNumber } = values;

    let options = {
      method: "POST",
      url: `${process.env.BASE_URL}/api/auth/signin`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        password,
        phoneNumber,
      }),
    };

    const postSignin = async () => {
      try {
        const response = await axios.request(options);

        if (response.data) {
          auth.initializedHandler(response.data?.initialized);
          auth.userRoleHandler(response.data?.role);
          auth.login(response.data?.userId, response.data?.token);
        } else {
          setVerificationPhoneNumber(phoneNumber);
          setShowVerification(true);
        }

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
    postSignin();
  };

  const verifySMS = async () => {
    setLoading(true);
    let options = {
      method: "POST",
      url: `${process.env.BASE_URL}/api/auth/verifySMS`,
      params: {
        phoneNumber: verificationPhoneNumber,
        verification: verificationPin,
      },
      headers: {
        "Content-Type": "application/json",
      },
    };

    const postVerification = async () => {
      try {
        const response = await axios.request(options);
        const data = response.data;

        if (data == "approved") {
          setShowLogin(true);
          localStorage.removeItem("verificationNumber");
          setVerificationPhoneNumber();
        } else if (data == "pending") {
          setMessage({
            text: "Invalid verification code. Please try again later.",
            error: true,
          });
        } else {
          setMessage({
            text: "Something went wrong please try again later.",
            error: true,
          });
        }

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

    postVerification();
  };

  const resendSmsVerification = () => {
    if (verificationPhoneNumber) {
      setLoading(true);

      let options = {
        method: "GET",
        url: `${process.env.BASE_URL}/api/auth/sendVerification`,
        params: {
          phoneNumber: verificationPhoneNumber,
        },
        headers: {
          "Content-Type": "application/json",
        },
      };

      const getVerification = async () => {
        try {
          const response = await axios.request(options);
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
      getVerification();
    }
  };

  return (
    <BaseLayout>
      <BasePage>
        <Container>
          <Row>
            <Col sm={{ size: 6, offset: 3 }}>
              {!showVerification ? (
                <Formik
                  initialValues={loginInfo}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    signin(values);
                  }}
                >
                  {({
                    values,
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                  }) => {
                    const { phoneNumber, password } = values;
                    return (
                      <div className="margin-top-100">
                        <h1 className="margin-bottom-15">Sign in</h1>

                        <Text
                          type="number"
                          name="phoneNumber"
                          placeholder="xxx-xxx-xxxx"
                          label="Phone Number"
                          error={errors.phoneNumber}
                          onBlur={handleBlur("phoneNumber")}
                          inputHandler={handleChange("phoneNumber")}
                          disabled={loading}
                          value={phoneNumber}
                        />

                        <Text
                          type="password"
                          name="password"
                          placeholder="Password"
                          label="Password"
                          error={errors.password}
                          onBlur={handleBlur("password")}
                          inputHandler={handleChange("password")}
                          disabled={loading}
                          value={password}
                          submitFunction={(e) => {
                            if (e.key === "Enter") {
                              handleSubmit();
                            }
                          }}
                        />

                        <Button
                          onClick={handleSubmit}
                          className="margin-top-10"
                          block
                          loading={loading}
                        >
                          Sign in
                        </Button>

                        <Notes>
                          <div>
                            <p>Forgot your password?</p>
                            <span>
                              <Link as="/auth/reset" href="/auth/reset">
                                Reset password
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
              ) : !showLogin ? (
                <div className="margin-top-100 margin-bottom-50 text-center">
                  <h1 className="margin-bottom-15">Verify Your Phone Number</h1>
                  {verificationPhoneNumber && (
                    <p>
                      Verification code is sent to {verificationPhoneNumber}
                    </p>
                  )}
                  <Otp
                    maxLength={6}
                    loading={loading}
                    handlePinReady={setIsPinReady}
                    value={verificationPin}
                    changeHandler={(e) => {
                      setVerificationPin(e.target.value);
                    }}
                  />

                  <Button
                    className="margin-top-10"
                    onClick={verifySMS}
                    block
                    loading={loading}
                    disabled={!isPinReady}
                  >
                    Verify Phone Number
                  </Button>
                  <Error error={message} setError={setMessage} />
                  <Notes>
                    <div>
                      <p>Didn't receive the verification code?</p>
                      <span onClick={resendSmsVerification}>Resend</span>
                    </div>
                  </Notes>
                </div>
              ) : (
                <div className="margin-top-100 margin-bottom-50 text-center">
                  <h1 className="margin-bottom-15">
                    Your phone number is now verified
                  </h1>

                  <Notes>
                    <div>
                      <p>You can now sign in</p>
                      <span
                        onClick={() => {
                          setShowVerification(false);
                        }}
                      >
                        Sign in
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

export default Signin;
