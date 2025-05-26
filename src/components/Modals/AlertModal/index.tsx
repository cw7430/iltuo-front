import React, { FC } from "react";
import { Button, Modal } from "react-bootstrap";

interface props {
    showAlertModal: boolean;
    handleCloseAlertModal: () => void;
    handleAfterAlert: () => void;
    alertTitle: string;
    alertText: string;
}

const AlertModal: FC<props> = ({
    showAlertModal,
    handleCloseAlertModal,
    handleAfterAlert,
    alertTitle,
    alertText,
}) => {
    return (
        <Modal
            backdrop="static"
            show={showAlertModal}
            onHide={handleCloseAlertModal}
            style={{ zIndex: 9999 }}
        >
            <Modal.Header>
                <Modal.Title>{alertTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{alertText}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="button" onClick={handleAfterAlert}>
                    {"확인"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AlertModal;
