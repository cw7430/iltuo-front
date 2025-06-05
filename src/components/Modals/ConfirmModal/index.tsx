import { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

interface Props {
  showConfirmModal: boolean;
  handleCloseConfirmModal: () => void;
  handleConfirm: () => void;
  confirmTitle: string;
  confirmText: string;
}

export default function ConfirmModal(props: Props) {
  const { showConfirmModal, handleCloseConfirmModal, handleConfirm, confirmTitle, confirmText } =
    props;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleConfirm();
      }
    };
    
    if (showConfirmModal) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showConfirmModal, handleConfirm]);

  return (
    <Modal
      backdrop="static"
      show={showConfirmModal}
      onHide={handleCloseConfirmModal}
      style={{ zIndex: 9999 }}
    >
      <Modal.Header>
        <Modal.Title>{confirmTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{confirmText}</Modal.Body>
      <Modal.Footer>
        <Button variant="success" type="button" onClick={handleConfirm}>
          {"확인"}
        </Button>
        <Button variant="danger" type="button" onClick={handleCloseConfirmModal}>
          {"취소"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
