import BaseLayout from "@/components/layout/BaseLayout";
import BasePage from "@/components/layout/BasePage";
import Error from "@/components/error/Error";
import Link from "next/link";
import Notes from "@/components/notes/Notes";
import React, { useState, useEffect, useContext, useRef } from "react";
import Text from "@/components/text/Text";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import { useRouter } from "next/router";

const Verify = () => {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState();

  useEffect(() => {
    if (!isVerified) {
      if (router.query.id) {
        verifyEmail(router.query.id);
      }
    }
  }, [router]);

  const verifyEmail = async (id) => {
    let options = {
      method: "POST",
      url: `${process.env.BASE_URL}/api/auth/verifyEmail`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        uniqueId: id,
      }),
    };

    const verifyAccount = async () => {
      try {
        const response = await axios.request(options);
        setIsVerified(true);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setMessage({
          text:
            err.response?.data?.message ||
            err.message ||
            "Something went wrong",
          error: true,
        });
      }
    };
    verifyAccount();
  };

  return (
    <BaseLayout>
      <BasePage>
        <Container>
          <Row>
            <Col sm={{ size: 6, offset: 3 }}>
              <div className="margin-top-100 text-center">
                <h1 className="margin-bottom-15">Verify your email address</h1>
                {!isVerified ? (
                  <p>
                    Please check your email and click on the verification link
                  </p>
                ) : (
                  <Notes>
                    <div>
                      <p>Your emil is now verified. </p>
                      <span>
                        <Link as="/auth/signin" href="/auth/signin">
                          Sign in
                        </Link>
                      </span>
                    </div>
                  </Notes>
                )}
              </div>
              <Error error={message} setError={setMessage} />
            </Col>
          </Row>
        </Container>
      </BasePage>
    </BaseLayout>
  );
};

export default Verify;
