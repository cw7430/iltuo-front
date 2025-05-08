import React, { FC, useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { EyeOn, EyeOff } from "../../Svg";

interface Props {
    showLogInModal: boolean;
    handleCloseLogInModal: () => void;
}

const LogInModal: FC<Props> = ({ showLogInModal, handleCloseLogInModal }) => {
    const [userId, setUserId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordType, setPasswordType] = useState<"password" | "text">("password");

    const handleChangePasswordType = () => {
        setPasswordType((prevType) => (prevType === "password" ? "text" : "password"));
    };

    const handleLogin = () => {
        // 로그인 로직 구현 예정
        console.log("로그인 시도:", { userId, password });
    };

    return (
        <Modal backdrop="static" show={showLogInModal} onHide={handleCloseLogInModal}>
            <Modal.Header>
                <Modal.Title>{"로그인"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formUserId">
                        <Form.Label>{"아이디"}</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="아이디를 입력하세요"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>{"비밀번호"}</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={passwordType}
                                placeholder="비밀번호를 입력하세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button variant="outline-secondary" onClick={handleChangePasswordType}>
                                {passwordType === "password" && <EyeOn />}
                                {passwordType === "text" && <EyeOff />}
                            </Button>
                        </InputGroup>
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
