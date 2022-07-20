import BaseLayout from "@/components/layout/BaseLayout";
import BasePage from "@/components/layout/BasePage";
import React from "react";
import { Container, Row, Col } from "reactstrap";

const Recovering = () => {
  return (
    <BaseLayout>
      <BasePage>
        <Container>
          <Row>
            <Col sm={{ size: 6, offset: 3 }}>
              <div className="margin-top-100 text-center">
                <h1 className="margin-bottom-15">Reset your password</h1>
                <p>Please check your email to reset your password</p>
              </div>
            </Col>
          </Row>
        </Container>
      </BasePage>
    </BaseLayout>
  );
};

export default Recovering;
