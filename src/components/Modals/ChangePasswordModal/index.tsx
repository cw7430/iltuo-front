import { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { EyeOff, EyeOn } from "../../Svg";
import ConfirmModal from "../ConfirmModal";
import { Loader } from "../../Gif";
import { PasswordRequestDto } from "../../../apis/dto/request/Auth";
import { ApiError } from "../../../apis/server";
import { fetchChangePassword } from "../../../apis/server/Auth";
import AlertModal from "../AlertModal";

interface Props {
  showChangePasswordModal: boolean;
  handleCloseChangePasswordModal: () => void;
}

export default function ChangePasswordModal(props: Props) {
  const { showChangePasswordModal, handleCloseChangePasswordModal } = props;

  const prevPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordCheckRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [prevPassword, setPrevPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordCheck, setNewPasswordCheck] = useState<string>("");
  const [prevPasswordType, setPrevPasswordType] = useState<"password" | "text">("password");
  const [newPasswordType, setNewPasswordType] = useState<"password" | "text">("password");
  const [newPasswordCheckType, setNewPasswordCheckType] = useState<"password" | "text">("password");
  const [prevPasswordError, setPrevPasswordError] = useState<boolean>(false);
  const [prevPasswordErrorMessage, setPrevPasswordErrorMessage] = useState<string>("");
  const [newPasswordValid, setNewPasswordValid] = useState<boolean>(false);
  const [newPasswordError, setNewPasswordError] = useState<boolean>(false);
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState<string>("");
  const [newPasswordCheckError, setNewPasswordCheckError] = useState<boolean>(false);
  const [newPasswordCheckErrorMessage, setNewPasswordCheckErrorMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);

  const handleShowConfirmModal = () => setShowConfirmModal(true);

  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  const handleShowAlertModal = () => setShowAlertModal(true);

  const handleCloseAlertModal = () => setShowAlertModal(false);

  const handleAfterAlert = () => {
    setShowAlertModal(false);
    handleCloseChangePasswordModal();
  };

  const handlePrevPasswordKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    if (!newPasswordRef.current) return;
    newPasswordRef.current.focus();
  };

  const handleNewPasswordKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    if (!newPasswordCheckRef.current) return;
    newPasswordCheckRef.current.focus();
  };

  const handleNewPasswordCheckKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    handleValidateTotal();
  };

  const handleChangePrevPasswordType = () =>
    setPrevPasswordType((prev) => (prev === "password" ? "text" : "password"));

  const handleChangeNewPasswordType = () =>
    setNewPasswordType((prev) => (prev === "password" ? "text" : "password"));

  const handleChangeNewPasswordCheckType = () =>
    setNewPasswordCheckType((prev) => (prev === "password" ? "text" : "password"));

  const handleValidateNewPassword = (): boolean => {
    setNewPasswordValid(false);
    setNewPasswordError(false);
    setNewPasswordCheckError(false);
    setNewPasswordErrorMessage("");
    setNewPasswordCheckErrorMessage("");

    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}|:;"'<>,.?/~`]).{10,25}$/;
    if (!newPassword.trim()) {
      setNewPasswordValid(false);
      setNewPasswordError(true);
      setNewPasswordErrorMessage("비밀번호를 입력해주세요.");
      return false;
    }

    if (prevPassword === newPassword) {
      setNewPasswordValid(false);
      setNewPasswordError(true);
      setNewPasswordErrorMessage("이전 비밀번호와 다른 비밀번호를 입력해주세요.");
      return false;
    }

    if (!regex.test(newPassword)) {
      setNewPasswordValid(false);
      setNewPasswordError(true);
      setNewPasswordErrorMessage(
        "비밀번호는 10자 이상 25자 이하이며, 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다."
      );
      return false;
    }

    return true;
  };

  const handleValidateNewPasswordCheck = (): boolean => {
    setNewPasswordValid(false);
    setNewPasswordCheckError(false);
    setNewPasswordCheckErrorMessage("");

    if (newPasswordError) {
      setNewPasswordValid(false);
      setNewPasswordCheckError(true);
      setNewPasswordCheckErrorMessage("비밀번호 조건을 확인해주세요");
      return false;
    }

    if (newPassword !== newPasswordCheck) {
      setNewPasswordValid(false);
      setNewPasswordCheckError(true);
      setNewPasswordCheckErrorMessage("비밀번호가 일치하지 않습니다.");
      return false;
    }

    setNewPasswordValid(true);
    return true;
  };

  const handleValidateTotal = () => {
    setIsError(false);
    setErrorMessage("");

    const newPasswordValidate = handleValidateNewPassword();
    const newPasswordCheckValidate = handleValidateNewPasswordCheck();

    if (!newPasswordValidate || !newPasswordCheckValidate) {
      setIsError(true);
      setErrorMessage("필수 조건 값을 확인하세요.");
      return;
    }

    handleShowConfirmModal();
  };

  const handleChangePassword = async () => {
    handleCloseConfirmModal();

    const responseBody: PasswordRequestDto = {
      prevPassword: prevPassword,
      newPassword: newPassword,
    };

    try {
      setIsLoading(true);
      const response = await fetchChangePassword(responseBody);
      if (response) {
        handleShowAlertModal();
      }
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.code === "VE") {
          setIsError(true);
          setErrorMessage("필수 조건 값을 확인하세요.");
        } else if (e.code === "LGE") {
          setIsError(true);
          setPrevPasswordError(true);
          setPrevPasswordErrorMessage("기존 비밀번호가 올바르지 않습니다.");
        } else if (e.code === "CF") {
          setNewPasswordValid(false);
          setNewPasswordError(true);
          setNewPasswordErrorMessage("이전 비밀번호와 다른 비밀번호를 입력해주세요.");
          setIsError(true);
        } else {
          setIsError(true);
          setErrorMessage("서버 오류입니다. 나중에 다시 시도하세요.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

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
      setNewPasswordCheckError(false);
      setNewPasswordCheckErrorMessage("");
      setIsError(false);
      setErrorMessage("");
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
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="change-password-prev-password">
              <Form.Label>{"이전 비밀번호"}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={prevPasswordType}
                  placeholder="이전 비밀번호를 입력하세요"
                  ref={prevPasswordRef}
                  value={prevPassword}
                  onChange={(e) => setPrevPassword(e.target.value)}
                  onKeyDown={handlePrevPasswordKeyDown}
                  isInvalid={prevPasswordError}
                />
                <Button variant="outline-secondary" onClick={handleChangePrevPasswordType}>
                  {prevPasswordType === "password" && <EyeOn />}
                  {prevPasswordType === "text" && <EyeOff />}
                </Button>
                <Form.Control.Feedback type="invalid">
                  {prevPasswordErrorMessage}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="change-password-new-password">
              <Form.Label>{"새로운 비밀번호"}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={newPasswordType}
                  placeholder="새로운 비밀번호를 입력하세요"
                  ref={newPasswordRef}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyDown={handleNewPasswordKeyDown}
                  isValid={newPasswordValid}
                  isInvalid={newPasswordError}
                  onBlur={handleValidateNewPassword}
                />
                <Button variant="outline-secondary" onClick={handleChangeNewPasswordType}>
                  {newPasswordType === "password" && <EyeOn />}
                  {newPasswordType === "text" && <EyeOff />}
                </Button>
                <Form.Control.Feedback type="invalid">
                  {newPasswordErrorMessage}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-4" controlId="change-password-new-password-check">
              <Form.Label>{"비밀번호 확인"}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={newPasswordCheckType}
                  placeholder="비밀번호 확인"
                  ref={newPasswordCheckRef}
                  value={newPasswordCheck}
                  onChange={(e) => setNewPasswordCheck(e.target.value)}
                  onKeyDown={handleNewPasswordCheckKeyDown}
                  isValid={newPasswordValid}
                  isInvalid={newPasswordCheckError}
                  onBlur={handleValidateNewPasswordCheck}
                />
                <Button variant="outline-secondary" onClick={handleChangeNewPasswordCheckType}>
                  {newPasswordCheckType === "password" && <EyeOn />}
                  {newPasswordCheckType === "text" && <EyeOff />}
                </Button>
                <Form.Control.Feedback>{"비밀번호가 일치합니다."}</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  {newPasswordCheckErrorMessage}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-4">
              {isError && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {errorMessage}
                </div>
              )}
            </Form.Group>
            <div className="d-grid gap-2 mb-3">
              <Button variant="primary" type="button" onClick={handleValidateTotal}>
                {"비밀번호 변겅"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" type="button" onClick={handleCloseChangePasswordModal}>
            {"닫기"}
          </Button>
        </Modal.Footer>
      </Modal>
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        handleCloseConfirmModal={handleCloseConfirmModal}
        confirmTitle="확인"
        confirmText="비밀번호를 변경하시겠습니까?"
        handleConfirm={handleChangePassword}
      />
      <AlertModal
        showAlertModal={showAlertModal}
        handleCloseAlertModal={handleCloseAlertModal}
        handleAfterAlert={handleAfterAlert}
        alertTitle="완료"
        alertText="비밀번호가 변경되었습니다."
      />
      {isLoading && <Loader />}
    </>
  );
}
