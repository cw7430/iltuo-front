import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { EyeOn, EyeOff } from "../../../components/Svg";
import { DaumPostCodeModal } from "../../../components/Modals";

export default function SignUp() {
    const userIdRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const checkPasswordRef = useRef<HTMLInputElement>(null);
    const userNameRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const detailAddressRef = useRef<HTMLInputElement>(null);

    const [userId, setUserId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [checkPassword, setCheckPassword] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [postalCode, setPostalCode] = useState<string>("");
    const [defaultAddress, setDefaultAddress] = useState<string>("");
    const [detailAddress, setDetailAddress] = useState<string>("");
    const [extraAddress, setExtraAddress] = useState<string>("");
    const [passwordType, setPasswordType] = useState<"password" | "text">("password");
    const [checkPasswordType, setCheckPasswordType] = useState<"password" | "text">("password");

    const [isUserIdError, setIsUseIdError] = useState<boolean>(false);
    const [userIdErrorMessage, setUserIdErrorMessage] = useState<string>("");
    const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [showDaumPostCodeModal, setShowDaumPostCodeModal] = useState<boolean>(false);

    const handleChangePasswordType = () => {
        setPasswordType((prevType) => (prevType === "password" ? "text" : "password"));
    };

    const handleChangeCheckPasswordType = () => {
        setCheckPasswordType((prevType) => (prevType === "password" ? "text" : "password"));
    };

    const handelShowDaumPostCodeModal = () => {
        setShowDaumPostCodeModal(true);
    };

    const handleCloseDaumPostCodeModal = () => {
        setShowDaumPostCodeModal(false);
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
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="signup-password">
                            <Form.Label>{"비밀번호 *"}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={passwordType}
                                    ref={passwordRef}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="10자 이상 25자 이하, 영문, 숫자, 특수문자의 조합"
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleChangePasswordType}
                                >
                                    {passwordType === "password" && <EyeOn />}
                                    {passwordType === "text" && <EyeOff />}
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="signup-checkPassword">
                            <Form.Label>{"비밀번호 확인 *"}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={checkPasswordType}
                                    ref={checkPasswordRef}
                                    value={checkPassword}
                                    onChange={(e) => setCheckPassword(e.target.value)}
                                    placeholder="비밀번호를 다시 입력하세요"
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleChangeCheckPasswordType}
                                >
                                    {checkPasswordType === "password" && <EyeOn />}
                                    {checkPasswordType === "text" && <EyeOff />}
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="signup-userName">
                            <Form.Label>{"이름 *"}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    ref={userNameRef}
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="이름을 입력하세요"
                                />
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
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="signup-email">
                            <Form.Label>{"이메일 *"}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    ref={emailRef}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="signup-postalCode"
                            style={{ maxWidth: "388px" }}
                        >
                            <Form.Label>{"우편번호 *"}</Form.Label>
                            <Row>
                                <Col xs={8}>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            readOnly={true}
                                            placeholder="우편번호"
                                        />
                                    </InputGroup>
                                </Col>
                                <Col xs={4}>
                                    <Button
                                        variant="secondary"
                                        onClick={handelShowDaumPostCodeModal}
                                    >
                                        {"주소찾기"}
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="signup-defaultAddress">
                            <Form.Label>{"주소 *"}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    value={defaultAddress}
                                    onChange={(e) => setDefaultAddress(e.target.value)}
                                    readOnly={true}
                                    placeholder="주소"
                                />
                            </InputGroup>
                        </Form.Group>

                        <Row className="mb-4">
                            <Form.Group as={Col} xs={6} controlId="signup-detailAddress">
                                <Form.Label>{"상세주소"}</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        ref={detailAddressRef}
                                        value={detailAddress}
                                        onChange={(e) => setDetailAddress(e.target.value)}
                                        placeholder="상세주소"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} xs={6} controlId="signup-extraAddress">
                                <Form.Label>{"참고항목"}</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        value={extraAddress}
                                        onChange={(e) => setExtraAddress(e.target.value)}
                                        readOnly={true}
                                        placeholder="참고항목"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Row>

                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit" size="lg">
                                {"회원가입"}
                            </Button>
                        </div>
                    </Form>
                </Container>
            </div>
            <DaumPostCodeModal
                showDaumPostCodeModal={showDaumPostCodeModal}
                handleCloseDaumPostCodeModal={handleCloseDaumPostCodeModal}
                setPostalCode={setPostalCode}
                setDefaultAddress={setDefaultAddress}
                setExtraAddress={setExtraAddress}
                detailAddressRef={detailAddressRef}
            />
        </>
    );
}
