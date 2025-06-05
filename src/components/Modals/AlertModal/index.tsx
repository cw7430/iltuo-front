import { Button, Modal } from "react-bootstrap";

interface Props {
  showAlertModal: boolean;
  handleCloseAlertModal: () => void;
  handleAfterAlert: () => void;
  alertTitle: string;
  alertText: string;
}

export default function AlertModal(props: Props) {
  const { showAlertModal, handleCloseAlertModal, handleAfterAlert, alertTitle, alertText } = props;

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
}
