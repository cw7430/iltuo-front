import React, { FC, useEffect, useRef, useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { EyeOn, EyeOff } from "../../Svg";
import { NativeSignInRequestDto } from "../../../apis/dto/request/auth";

interface Props {
    showLogInModal: boolean;
    handleCloseLogInModal: () => void;
}

const LogInModal: FC<Props> = ({ showLogInModal, handleCloseLogInModal }) => {
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
        handleLogin();
    };

    const nativeSignInBody: NativeSignInRequestDto = {
        userId: userId,
        password: password,
    };

    const handleLogin = () => {
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

        setIsError(true);
        setErrorMessage("메세지 테스트");
        console.log("로그인 시도:", nativeSignInBody);
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
                                onChange={(e) => setUserId(e.target.value)}
                                onKeyDown={handleUserIdKeyDown}
                                isInvalid={isUserIdError}
                            />
                            <Form.Control.Feedback type="invalid">
                                {userIdErrorMessage}
                            </Form.Control.Feedback>
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
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handlePasswordKeyDown}
                                isInvalid={isPasswordError}
                            />
                            <Button variant="outline-secondary" onClick={handleChangePasswordType}>
                                {passwordType === "password" && <EyeOn />}
                                {passwordType === "text" && <EyeOff />}
                            </Button>
                            <Form.Control.Feedback type="invalid">
                                {passwordErrorMessage}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        {isError && (
                            <div className="invalid-feedback" style={{ display: "block" }}>
                                {errorMessage}
                            </div>
                        )}
                    </Form.Group>

                    <div className="d-grid gap-2 mb-3">
                        <Button variant="primary" onClick={handleLogin}>
                            {"로그인"}
                        </Button>
                    </div>

                    {/* 소셜 로그인 버튼 자리 */}
                    <div className="d-grid gap-2 mb-2">
                        <Button variant="outline-primary" disabled>
                            {"구글 로그인 (예정)"}
                        </Button>
                        <Button variant="outline-warn" disabled>
                            {"카카오 로그인 (예정)"}
                        </Button>
                        <Button variant="outline-success" disabled>
                            {"네이버 로그인 (예정)"}
                        </Button>
                    </div>

                    {/* 회원가입 안내 */}
                    <div className="text-center mt-3">
                        <span>{"계정이 없으신가요?"}</span>
                        <Button
                            variant="link"
                            size="sm"
                            onClick={() => alert("회원가입 이동 예정")}
                        >
                            {"회원가입"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleCloseLogInModal}>
                    {"닫기"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LogInModal;
