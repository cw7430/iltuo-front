import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { EyeOn, EyeOff } from "../../../components/Svg";
import { AlertModal } from "../../../components/Modals";
import { Loader } from "../../../components/Gif";
import { fetchCheckUserIdDuplicate, fetchSignUpNative } from "../../../apis/server/Auth";
import {
  UserIdDuplicateCheckRequestDto,
  NativeSignUpRequestDto,
} from "../../../apis/dto/request/Auth";
import { ApiError } from "../../../apis/server";
import { loginUser } from "../../../utils/auth";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH } from "../../../constants/url";

export default function SignUp() {
  const navigete = useNavigate();

  const userIdRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [checkPassword, setCheckPassword] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [passwordType, setPasswordType] = useState<"password" | "text">("password");
  const [checkPasswordType, setCheckPasswordType] = useState<"password" | "text">("password");

  const [isUserIdValid, setIsUserIdValid] = useState<boolean>(false);
  const [isUserIdError, setIsUseIdError] = useState<boolean>(false);
  const [userIdErrorMessage, setUserIdErrorMessage] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
  const [isPasswordCheckError, setIsPasswordCheckError] = useState<boolean>(false);
  const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>("");
  const [isUserNameValid, setIsUserNameValid] = useState<boolean>(false);
  const [isUserNameError, setIsUserNameError] = useState<boolean>(false);
  const [userNameErrorMessage, setUserNameErrorMessage] = useState<string>("");
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState<boolean>(false);
  const [isPhoneNumberError, setIsPhoneNumberError] = useState<boolean>(false);
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertText, setAlertText] = useState<string>("");

  const handleChangePasswordType = () => {
    setPasswordType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  const handleChangeCheckPasswordType = () => {
    setCheckPasswordType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  const handleHypenPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const formattedValue = inputValue
      .replace(/[^0-9]/g, "")
      .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
    if (!phoneNumberRef.current) return;
    phoneNumberRef.current.value = formattedValue;
  };

  const handleShowAlertModal = (title: string, text: string) => {
    setAlertTitle(title);
    setAlertText(text);
    setShowAlertModal(true);
  };

  const handleCloseAlertModal = () => setShowAlertModal(false);

  const handleAfterAlert = () => {
    setShowAlertModal(false);
    navigete(MAIN_PATH());
  };

  const handleValidateUserId = async (): Promise<boolean> => {
    setIsUserIdValid(false);
    setIsUseIdError(false);
    setUserIdErrorMessage("");

    const regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{5,25}$/;

    if (!userId.trim()) {
      setIsUserIdValid(false);
      setIsUseIdError(true);
      setUserIdErrorMessage("아이디를 입력해주세요.");
      return false;
    }

    if (!regex.test(userId)) {
      setIsUserIdValid(false);
      setIsUseIdError(true);
      setUserIdErrorMessage(
        "아이디는 5자 이상 25자 이하, 영문 또는 영문, 숫자의 조합이어야 합니다."
      );
      return false;
    }

    const requestBody: UserIdDuplicateCheckRequestDto = { userId: userId };

    try {
      setIsUseIdError(false);
      setUserIdErrorMessage("");
      const result = await fetchCheckUserIdDuplicate(requestBody);
      if (result) {
        setIsUserIdValid(true);
        return true;
      }
    } catch (e) {
      if (e instanceof ApiError) {
        setIsUserIdValid(false);
        setIsUseIdError(true);
        switch (e.code) {
          case "DR":
            setUserIdErrorMessage("중복된 아이디입니다.");
            break;
          case "VE":
            setUserIdErrorMessage(e.message);
            break;
          default:
            setUserIdErrorMessage("서버 오류입니다. 나중에 다시 시도하세요.");
            break;
        }
      }
      return false;
    }

    // 혹시라도 예상치 못한 상황이면 false로 처리
    return false;
  };

  const handleValidatePassword = (): boolean => {
    setIsPasswordValid(false);
    setIsPasswordError(false);
    setIsPasswordCheckError(false);
    setPasswordErrorMessage("");
    setPasswordCheckErrorMessage("");

    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}|:;"'<>,.?/~`]).{10,25}$/;
    if (!password.trim()) {
      setIsPasswordValid(false);
      setIsPasswordError(true);
      setPasswordErrorMessage("비밀번호를 입력해주세요.");
      return false;
    }

    if (!regex.test(password)) {
      setIsPasswordValid(false);
      setIsPasswordError(true);
      setPasswordErrorMessage(
        "비밀번호는 10자 이상 25자 이하이며, 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다."
      );
      return false;
    }

    return true;
  };

  const handleValidatePasswordCheck = (): boolean => {
    setIsPasswordValid(false);
    setIsPasswordCheckError(false);
    setPasswordCheckErrorMessage("");

    if (isPasswordError) {
      setIsPasswordValid(false);
      setIsPasswordCheckError(true);
      setPasswordCheckErrorMessage("비밀번호 조건을 확인해주세요");
      return false;
    }

    if (password !== checkPassword) {
      setIsPasswordValid(false);
      setIsPasswordCheckError(true);
      setPasswordCheckErrorMessage("비밀번호가 일치하지 않습니다.");
      return false;
    }

    setIsPasswordValid(true);
    return true;
  };

  const handleValidateUserName = (): boolean => {
    setIsUserNameValid(false);
    setIsUserNameError(false);
    setUserNameErrorMessage("");

    const regex = /^[가-힣]+$/;

    if (!userName.trim()) {
      setIsUserNameValid(false);
      setIsUserNameError(true);
      setUserNameErrorMessage("이름을 입력하여주세요.");
      return false;
    }

    if (!regex.test(userName)) {
      setIsUserNameValid(false);
      setIsUserNameError(true);
      setUserNameErrorMessage("이름 형식이 올바르지 않습니다.");
      return false;
    }

    setIsUserNameValid(true);
    return true;
  };

  const handleValidatePhoneNumber = (): boolean => {
    setIsPhoneNumberValid(false);
    setIsPhoneNumberError(false);
    setPhoneNumberErrorMessage("");

    const regex = /^(010|011|016|017|018|019)-\d{3,4}-\d{4}$/;

    if (!phoneNumber.trim()) {
      setIsPhoneNumberValid(false);
      setIsPhoneNumberError(true);
      setPhoneNumberErrorMessage("휴대전화 번호를 입력해주세요.");
      return false;
    }

    if (!regex.test(phoneNumber)) {
      setIsPhoneNumberValid(false);
      setIsPhoneNumberError(true);
      setPhoneNumberErrorMessage("휴대전화번호 형식이 올바르지 않습니다.");
      return false;
    }

    setIsPhoneNumberValid(true);
    return true;
  };

  const handleValidateEmail = (): boolean => {
    setIsEmailValid(false);
    setIsEmailError(false);
    setEmailErrorMessage("");

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email.trim()) {
      setIsEmailValid(false);
      setIsEmailError(true);
      setEmailErrorMessage("이메일을 입력하여주세요.");
      return false;
    }

    if (!regex.test(email)) {
      setIsEmailValid(false);
      setIsEmailError(true);
      setEmailErrorMessage("이메일 형식이 올바르지 않습니다.");
      return false;
    }

    setIsEmailValid(true);
    return true;
  };

  const handleValidateTotal = async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");

    const userIdValidate = await handleValidateUserId();
    const passwortValidate = handleValidatePassword();
    const passwordCheckValidate = handleValidatePasswordCheck();
    const userNameValidate = handleValidateUserName();
    const phoneNumberValidate = handleValidatePhoneNumber();
    const emailValidate = handleValidateEmail();

    if (
      !userIdValidate ||
      !passwortValidate ||
      !passwordCheckValidate ||
      !userNameValidate ||
      !phoneNumberValidate ||
      !emailValidate
    ) {
      setIsError(true);
      setErrorMessage("필수 조건 값을 확인하세요.");
      setIsLoading(false);
      return;
    }

    handleSignUpNative();
  };

  const handleSignUpNative = async () => {
    const resquestBody: NativeSignUpRequestDto = {
      userId: userId,
      password: password,
      userName: userName,
      phoneNumber: phoneNumber,
      email: email,
    };

    try {
      const result = await fetchSignUpNative(resquestBody);
      loginUser(
        result.accessTokenExpiresAt,
        result.refreshTokenExpiresAt,
        result.userPermission,
        result.authMethod
      );
      handleShowAlertModal("완료", "회원가입이 완료되었습니다.");
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.code === "DR") {
          setIsError(true);
          setErrorMessage("필수 조건 값을 확인하세요.");
        } else if (e.code === "VE") {
          setIsError(true);
          setErrorMessage("필수 조건 값을 확인하세요.");
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
    if (!userIdRef.current) return;
    userIdRef.current.focus();
  }, []);

  return (
    <>
      <div className="coffee_section layout_padding">
        <Container style={{ maxWidth: "800px" }}>
          <Row>
            <Col md={12}>
              <h1 className="coffee_taital">{"회원가입"}</h1>
            </Col>
          </Row>
        </Container>
        <Container className="py-5" style={{ maxWidth: "800px" }}>
          <Row className="text-end">
            <Col className="mb-3">{"* 필수입력사항"}</Col>
          </Row>
          <Form>
            <Form.Group className="mb-3" controlId="signup-userId">
              <Form.Label>{"아이디 *"}</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  ref={userIdRef}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="5자 이상 25자 이하, 영문 또는 영문, 숫자의 조합"
                  isValid={isUserIdValid}
                  isInvalid={isUserIdError}
                  onBlur={handleValidateUserId}
                  maxLength={25}
                />
                <Form.Control.Feedback>{"사용 가능한 아이디입니다."}</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">{userIdErrorMessage}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="signup-password">
              <Form.Label>{"비밀번호 *"}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={passwordType}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="10자 이상 25자 이하, 영문, 숫자, 특수문자의 조합"
                  isValid={isPasswordValid}
                  isInvalid={isPasswordError}
                  onBlur={handleValidatePassword}
                  maxLength={25}
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={handleChangePasswordType}
                >
                  {passwordType === "password" && <EyeOn />}
                  {passwordType === "text" && <EyeOff />}
                </Button>
                <Form.Control.Feedback type="invalid">{passwordErrorMessage}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="signup-checkPassword">
              <Form.Label>{"비밀번호 확인 *"}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={checkPasswordType}
                  value={checkPassword}
                  onChange={(e) => setCheckPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  isValid={isPasswordValid}
                  isInvalid={isPasswordCheckError}
                  onBlur={handleValidatePasswordCheck}
                  maxLength={25}
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={handleChangeCheckPasswordType}
                >
                  {checkPasswordType === "password" && <EyeOn />}
                  {checkPasswordType === "text" && <EyeOff />}
                </Button>
                <Form.Control.Feedback>{"비밀번호가 일치합니다."}</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  {passwordCheckErrorMessage}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="signup-userName">
              <Form.Label>{"이름 *"}</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  isValid={isUserNameValid}
                  isInvalid={isUserNameError}
                  onBlur={handleValidateUserName}
                />
                <Form.Control.Feedback type="invalid">{userNameErrorMessage}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="signup-phoneNumber">
              <Form.Label>{"휴대전화번호 *"}</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  ref={phoneNumberRef}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="010-xxxx-xxxx"
                  onInput={handleHypenPhone}
                  isValid={isPhoneNumberValid}
                  isInvalid={isPhoneNumberError}
                  onBlur={handleValidatePhoneNumber}
                  maxLength={13}
                />
                <Form.Control.Feedback type="invalid">
                  {phoneNumberErrorMessage}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="signup-email">
              <Form.Label>{"이메일 *"}</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  isValid={isEmailValid}
                  isInvalid={isEmailError}
                  onBlur={handleValidateEmail}
                />
                <Form.Control.Feedback type="invalid">{emailErrorMessage}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              {isError && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {errorMessage}
                </div>
              )}
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="button" size="lg" onClick={handleValidateTotal}>
                {"회원가입"}
              </Button>
            </div>
          </Form>
        </Container>
      </div>
      {isLoading && <Loader />}
      <AlertModal
        showAlertModal={showAlertModal}
        handleCloseAlertModal={handleCloseAlertModal}
        handleAfterAlert={handleAfterAlert}
        alertTitle={alertTitle}
        alertText={alertText}
      />
    </>
  );
}
