import React, { FC } from "react";
import { Modal, Button } from "react-bootstrap";

interface props {
    showConfirmModal: boolean;
    handleCloseConfirmModal: () => void;
    handleConfirm: () => void;
    confirmTitle: string;
    confirmText: string;
}

const ConfirmModal: FC<props> = ({
    showConfirmModal,
    handleCloseConfirmModal,
    handleConfirm,
    confirmTitle,
    confirmText,
}) => {
    return (
        <Modal
            backdrop="static"
            show={showConfirmModal}
            onHide={handleCloseConfirmModal}
        >
            <Modal.Header>
                <Modal.Title>{confirmTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{confirmText}</Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleConfirm}>
                    {"확인"}
                </Button>
                <Button variant="danger" onClick={handleCloseConfirmModal}>
                    {"취소"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;