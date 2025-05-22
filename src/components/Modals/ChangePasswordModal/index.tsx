import { FC, useEffect, useRef, useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";

interface Props {
    showChangePasswordModal: boolean;
    handleCloseChangePasswordModal: () => void;
}

const ChangePasswordModal: FC<Props> = ({
    showChangePasswordModal,
    handleCloseChangePasswordModal,
}) => {
    const prevPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordCheckRef = useRef<HTMLInputElement>(null);

    const [prevPassword, setPrevPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [newPasswordCheck, setNewPasswordCheck] = useState<string>("");
    const [prevPasswordType, setPrevPasswordType] = useState<"password" | "text">("password");
    const [newPasswordType, setNewPasswordType] = useState<"password" | "text">("password");
    const [newPasswordCheckType, setNewPasswordCheckType] = useState<"password" | "text">(
        "password"
    );
    const [prevPasswordError, setPrevPasswordError] = useState<boolean>(false);
    const [prevPasswordErrorMessage, setPrevPasswordErrorMessage] = useState<string>("");
    const [newPasswordValid, setNewPasswordValid] = useState<boolean>(false);
    const [newPasswordError, setNewPasswordError] = useState<boolean>(false);
    const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState<string>("");
    const [newPasswordCheckVaild, setNewPasswordCheckVaild] = useState<boolean>(false);
    const [newPasswordCheckError, setNewPasswordCheckError] = useState<boolean>(false);
    const [newPasswordCheckErrorMessage, setNewPasswordCheckErrorMessage] = useState<string>("");

    useEffect(() => {
        if (!showChangePasswordModal) {
            setPrevPassword("");
            setNewPassword("");
            setNewPasswordCheck("");
            setPrevPasswordType("password");
            setNewPasswordType("password");
            setNewPasswordCheckType("password");
            setPrevPasswordError(false);
            setPrevPasswordErrorMessage("");
            setNewPasswordValid(false);
            setNewPasswordError(false);
            setNewPasswordErrorMessage("");
            setNewPasswordCheckVaild(false);
            setNewPasswordCheckError(false);
            setNewPasswordCheckErrorMessage("");
        } else {
            if (!prevPasswordRef.current) return;
            prevPasswordRef.current.focus();
        }
    }, [showChangePasswordModal]);
    return (
        <>
            <Modal
                backdrop="static"
                show={showChangePasswordModal}
                onHide={handleCloseChangePasswordModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{"비밀번호 변경"}</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseChangePasswordModal}>
                        {"닫기"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ChangePasswordModal;
