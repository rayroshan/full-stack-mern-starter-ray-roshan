import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const ModalBox = (props) => {
  const {
    title,
    className,
    show,
    toggle,
    children,
    footer,
    cancel,
    footerCancelHandler,
    footerCancelText,
    footerDoneHandler,
    footerDoneText,
  } = props;

  return (
    <div>
      <Modal
        isOpen={show}
        fade={true}
        toggle={toggle}
        className={className}
      >
        {title && <ModalHeader toggle={toggle}>{title}</ModalHeader>}
        <ModalBody>{children}</ModalBody>
        {footer && (
          <ModalFooter>
            <Button
              color="secondary"
              onClick={cancel ? toggle : footerCancelHandler}
            >
              {cancel ? "Cancel" : footerCancelText}
            </Button>{" "}
            <Button color="primary" onClick={footerDoneHandler}>
              {footerDoneText}
            </Button>
          </ModalFooter>
        )}
      </Modal>
    </div>
  );
};

export default ModalBox;
