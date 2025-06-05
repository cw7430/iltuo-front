import { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { EyeOn, EyeOff } from "../../Svg";
import { NativeSignInRequestDto } from "../../../apis/dto/request/Auth";
import { loginUser } from "../../../utils/auth";
import { fetchSignInNative } from "../../../apis/server/Auth";
import { ApiError } from "../../../apis/server";
import { Loader } from "../../Gif";
import { SocialButton } from "../../Button";
import { useNavigate } from "react-router-dom";
import { PLAIN_PATH } from "../../../constants/url";

interface Props {
  showLogInModal: boolean;
  handleCloseLogInModal: () => void;
}

export default function LogInModal(props: Props) {
  const { showLogInModal, handleCloseLogInModal } = props;

  const navigate = useNavigate();

  const userIdRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordType, setPasswordType] = useState<"password" | "text">("password");
  const [isUserIdError, setIsUseIdError] = useState<boolean>(false);
  const [userIdErrorMessage, setUserIdErrorMessage] = useState<string>("");
  const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleNavigateSignUpPage = () => {
    navigate(PLAIN_PATH("sign_up", null));
    handleCloseLogInModal();
  };

  const handleChangePasswordType = () => {
    setPasswordType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  const handleUserIdKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    if (!passwordRef.current) return;
    passwordRef.current.focus();
  };

  const handlePasswordKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    handleValidate();
  };

  const nativeSignInBody: NativeSignInRequestDto = {
    userId: userId,
    password: password,
  };

  const handleValidate = () => {
    let valid = true;

    if (!userId.trim()) {
      setIsUseIdError(true);
      setUserIdErrorMessage("아이디를 입력하세요.");
      valid = false;
    } else {
      setIsUseIdError(false);
      setUserIdErrorMessage("");
    }

    if (!password.trim()) {
      setIsPasswordError(true);
      setPasswordErrorMessage("비밀번호를 입력하세요.");
      valid = false;
    } else {
      setIsPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!valid) return;

    handleSignInNative();
  };

  const handleSignInNative = async () => {
    try {
      setIsLoading(true);
      const result = await fetchSignInNative(nativeSignInBody);
      loginUser(
        result.accessTokenExpiresAt,
        result.refreshTokenExpiresAt,
        result.userPermission,
        result.authMethod
      );
      handleCloseLogInModal();
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.code === "LGE") {
          setIsError(true);
          setErrorMessage(e.message);
          console.log(e.message);
        } else {
          setIsError(true);
          setErrorMessage("서버 오류입니다. 나중에 다시 시도하세요.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInSocial = (providerName: "naver" | "kakao" | "google") => {
    window.location.href = `${process.env.REACT_APP_API_BASE_URL}/auth/social/${providerName}`;
  };

  useEffect(() => {
    if (showLogInModal) {
      if (!userIdRef.current) return;
      userIdRef.current.focus();
    } else {
      setIsUseIdError(false);
      setUserIdErrorMessage("");
      setIsPasswordError(false);
      setPasswordErrorMessage("");
      setIsError(false);
      setErrorMessage("");
      setUserId("");
      setPassword("");
      setPasswordType("password");
    }
  }, [showLogInModal]);

  return (
    <Modal backdrop="static" show={showLogInModal} onHide={handleCloseLogInModal}>
      <Modal.Header closeButton>
        <Modal.Title>{"로그인"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="signin-userId">
            <Form.Label>{"아이디"}</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="아이디를 입력하세요"
                ref={userIdRef}
                value={userId}
                maxLength={25}
                onChange={(e) => setUserId(e.target.value)}
                onKeyDown={handleUserIdKeyDown}
                isInvalid={isUserIdError}
              />
              <Form.Control.Feedback type="invalid">{userIdErrorMessage}</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="signin-password">
            <Form.Label>{"비밀번호"}</Form.Label>
            <InputGroup>
              <Form.Control
                type={passwordType}
                placeholder="비밀번호를 입력하세요"
                ref={passwordRef}
                value={password}
                maxLength={25}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handlePasswordKeyDown}
                isInvalid={isPasswordError}
              />
              <Button variant="outline-secondary" type="button" onClick={handleChangePasswordType}>
                {passwordType === "password" && <EyeOn />}
                {passwordType === "text" && <EyeOff />}
              </Button>
              <Form.Control.Feedback type="invalid">{passwordErrorMessage}</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            {isError && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errorMessage}
              </div>
            )}
          </Form.Group>
          {isLoading && <Loader />}

          <div className="d-grid gap-2 mb-3">
            <Button variant="primary" type="button" onClick={handleValidate}>
              {"로그인"}
            </Button>
          </div>

          {/* 소셜 로그인 버튼 자리 */}
          <hr />
          <div className="text-center text-muted mb-2">소셜 로그인</div>

          <div className="d-flex justify-content-center gap-2 mb-3">
            <button type="button" onClick={() => handleSignInSocial("naver")}>
              <SocialButton providerName="naver" />
            </button>
            <button type="button" onClick={() => handleSignInSocial("kakao")}>
              <SocialButton providerName="kakao" />
            </button>
            <button type="button" onClick={() => handleSignInSocial("google")}>
              <SocialButton providerName="google" />
            </button>
          </div>
          <hr />
          {/* 회원가입 안내 */}
          <div className="text-center mt-3">
            <span>{"계정이 없으신가요?"}</span>
            <Button variant="link" size="sm" onClick={handleNavigateSignUpPage}>
              {"회원가입"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" type="button" onClick={handleCloseLogInModal}>
          {"닫기"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
