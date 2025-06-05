import { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import ConfirmModal from "../ConfirmModal";
import AlertModal from "../AlertModal";
import { EyeOff, EyeOn } from "../../Svg";
import { Loader } from "../../Gif";
import { ProfileRequestDto } from "../../../apis/dto/request/Auth";
import { fetchChangeProfile } from "../../../apis/server/Auth";
import { ApiError } from "../../../apis/server";

interface Props {
  showChangeProfileModal: boolean;
  handleCloseChangeProfileModal: () => void;
  userId: string;
  userName: string | null;
  email: string | null;
  phoneNumber: string | null;
  updateData: () => void;
}

export default function ChangeProfileModal(props: Props) {
  const {
    showChangeProfileModal,
    handleCloseChangeProfileModal,
    userId,
    userName,
    email,
    phoneNumber,
    updateData,
  } = props;

  const emailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [changedEmail, setChangedEmail] = useState<string>(email ? email : "");
  const [changedPhoneNumber, setChangedPhoneNumber] = useState<string>(
    phoneNumber ? phoneNumber : ""
  );
  const [password, setPassword] = useState<string>("");
  const [passwordType, setPasswordType] = useState<"password" | "text">("password");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false);
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
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
    updateData();
    handleCloseChangeProfileModal();
  };

  const handleChangePasswordType = () => {
    setPasswordType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  const handleHypenPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const formattedValue = inputValue
      .replace(/[^0-9]/g, "")
      .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
    if (!phoneNumberRef.current) return;
    phoneNumberRef.current.value = formattedValue;
  };

  const handleValidateEmail = (): boolean => {
    setEmailError(false);
    setEmailErrorMessage("");

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!changedEmail.trim()) {
      setEmailError(true);
      setEmailErrorMessage("이메일을 입력하여주세요.");
      return false;
    }

    if (!regex.test(changedEmail)) {
      setEmailError(true);
      setEmailErrorMessage("이메일 형식이 올바르지 않습니다.");
      return false;
    }

    return true;
  };

  const handleValidatePhoneNumber = (): boolean => {
    setPhoneNumberError(false);
    setPhoneNumberErrorMessage("");

    const regex = /^(010|011|016|017|018|019)-\d{3,4}-\d{4}$/;

    if (!changedPhoneNumber.trim()) {
      setPhoneNumberError(true);
      setPhoneNumberErrorMessage("휴대전화 번호를 입력해주세요.");
      return false;
    }

    if (!regex.test(changedPhoneNumber)) {
      setPhoneNumberError(true);
      setPhoneNumberErrorMessage("휴대전화번호 형식이 올바르지 않습니다.");
      return false;
    }

    return true;
  };

  const handleValidatePassword = (): boolean => {
    setPasswordError(false);
    setPasswordErrorMessage("");

    if (!password.trim()) {
      setPasswordError(true);
      setPasswordErrorMessage("비밀번호를 입력하여주세요.");
      return false;
    }

    return true;
  };

  const handleValidateTotal = () => {
    setIsError(false);
    setErrorMessage("");

    const emailValidate = handleValidateEmail();
    const phoneNumberValidate = handleValidatePhoneNumber();
    const passwordVaildate = handleValidatePassword();

    if (!emailValidate || !phoneNumberValidate || !passwordVaildate) {
      setIsError(true);
      setErrorMessage("필수 조건 값을 확인하세요.");
      return;
    }

    handleShowConfirmModal();
  };

  const handleChangeProfile = async () => {
    handleCloseConfirmModal();

    const responseBody: ProfileRequestDto = {
      email: changedEmail,
      phoneNumber: changedPhoneNumber,
      password: password,
    };

    try {
      setIsLoading(true);
      const response = await fetchChangeProfile(responseBody);
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
          setPasswordError(true);
          setPasswordErrorMessage("비밀번호가 올바르지 않습니다.");
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
    if (!showChangeProfileModal) {
      setChangedEmail(email ? email : "");
      setChangedPhoneNumber(phoneNumber ? phoneNumber : "");
      setPassword("");
      setPasswordType("password");
      setEmailError(false);
      setEmailErrorMessage("");
      setPhoneNumberError(false);
      setPhoneNumberErrorMessage("");
      setPasswordError(false);
      setPasswordErrorMessage("");
      setIsError(false);
      setErrorMessage("");
    }
  }, [showChangeProfileModal, email, phoneNumber]);

  return (
    <>
      <Modal backdrop="static" show={showChangeProfileModal} onHide={handleCloseChangeProfileModal}>
        <Modal.Header closeButton>
          <Modal.Title>{"프로필 변경"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="change-profile-user-id">
              <Form.Label>{"아이디"}</Form.Label>
              <InputGroup>
                <Form.Text>
                  <strong>{userId}</strong>
                </Form.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="change-profile-user-name">
              <Form.Label>{"이름"}</Form.Label>
              <InputGroup>
                <Form.Text>
                  <strong>{userName}</strong>
                </Form.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="change-profile-email">
              <Form.Label>{"이메일"}</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  ref={emailRef}
                  value={changedEmail}
                  onChange={(e) => setChangedEmail(e.target.value)}
                  onBlur={handleValidateEmail}
                  isInvalid={emailError}
                />
                <Form.Control.Feedback type="invalid">{emailErrorMessage}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="change-phone-number">
              <Form.Label>{"휴대전화번호"}</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  ref={phoneNumberRef}
                  value={changedPhoneNumber}
                  onChange={(e) => setChangedPhoneNumber(e.target.value)}
                  onInput={handleHypenPhone}
                  onBlur={handleValidatePhoneNumber}
                  isInvalid={phoneNumberError}
                />
                <Form.Control.Feedback type="invalid">
                  {phoneNumberErrorMessage}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="change-password">
              <Form.Label>{"비밀번호"}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={passwordType}
                  ref={passwordRef}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleValidatePassword}
                  isInvalid={passwordError}
                />
                <Button variant="outline-secondary" onClick={handleChangePasswordType}>
                  {passwordType === "password" && <EyeOn />}
                  {passwordType === "text" && <EyeOff />}
                </Button>
                <Form.Control.Feedback type="invalid">{passwordErrorMessage}</Form.Control.Feedback>
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
                {"프로필 변겅"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" type="button" onClick={handleCloseChangeProfileModal}>
            {"닫기"}
          </Button>
        </Modal.Footer>
      </Modal>
      {isLoading && <Loader />}
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        handleCloseConfirmModal={handleCloseConfirmModal}
        confirmTitle="확인"
        confirmText="프로필을 변경하시겠습니까?"
        handleConfirm={handleChangeProfile}
      />
      <AlertModal
        showAlertModal={showAlertModal}
        handleCloseAlertModal={handleCloseAlertModal}
        handleAfterAlert={handleAfterAlert}
        alertTitle="완료"
        alertText="프로필이 변경되었습니다."
      />
    </>
  );
}
