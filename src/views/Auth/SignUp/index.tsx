import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { EyeOn, EyeOff } from "../../../components/Svg";
import { DaumPostCodeModal, AlertModal } from "../../../components/Modals";
import { Loader } from "../../../components/Gif";
import { fetchCheckUserIdDuplicate } from "../../../apis/server/Auth";
import { UserIdDuplicateCheckRequestDto, NativeSignUpRequestDto } from "../../../apis/dto/request/Auth";
import { ApiError } from "../../../apis/server";

export default function SignUp() {
    const userIdRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null);
    const detailAddressRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
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
    const [isAddressValid, setIsAddressValid] = useState<boolean>(false);
    const [isAddressError, setIsAddressError] = useState<boolean>(false);
    const [addressErrorMessage, setAddressErrorMessage] = useState<string>("");
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [showDaumPostCodeModal, setShowDaumPostCodeModal] = useState<boolean>(false);

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

    const handelShowDaumPostCodeModal = () => setShowDaumPostCodeModal(true);

    const handleCloseDaumPostCodeModal = () => setShowDaumPostCodeModal(false);

    const handleShowAlertModal = (title: string, text: string) => {
        setAlertTitle(title);
        setAlertText(text);
        setShowAlertModal(true);
    };

    const handleCloseAlertModal = () => setShowAlertModal(false);

    const handleValidateUserId = async () => {
        setIsUserIdValid(false);
        setIsUseIdError(false);
        setUserIdErrorMessage("");

        const regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{5,25}$/;

        if (!userId.trim()) {
            setIsUserIdValid(false);
            setIsUseIdError(true);
            setUserIdErrorMessage("아이디를 입력해주세요.");
            return;
        }

        if (!regex.test(userId)) {
            setIsUserIdValid(false);
            setIsUseIdError(true);
            setUserIdErrorMessage(
                "아이디는 5자 이상 25자 이하, 영문 또는 영문, 숫자의 조합이어야 합니다."
            );
            return;
        }

        const responseBody: UserIdDuplicateCheckRequestDto = { userId: userId };

        try {
            setIsUseIdError(false);
            setUserIdErrorMessage("");
            const result = await fetchCheckUserIdDuplicate(responseBody);
            if (result) {
                setIsUseIdError(false);
                setIsUserIdValid(true);
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
        }
    };

    const handleValidatePassword = () => {
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
            return;
        }

        if (!regex.test(password)) {
            setIsPasswordValid(false);
            setIsPasswordError(true);
            setPasswordErrorMessage(
                "비밀번호는 10자 이상 25자 이하이며, 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다."
            );
            return;
        }
    };

    const handleValidatePasswordCheck = () => {
        setIsPasswordValid(false);
        setIsPasswordCheckError(false);
        setPasswordCheckErrorMessage("");

        if (isPasswordError) {
            setIsPasswordValid(false);
            setIsPasswordCheckError(true);
            setPasswordCheckErrorMessage("비밀번호 조건을 확인해주세요");
            return;
        }

        if (password !== checkPassword) {
            setIsPasswordValid(false);
            setIsPasswordCheckError(true);
            setPasswordCheckErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        setIsPasswordValid(true);
    };

    const handleValidateUserName = () => {
        setIsUserNameValid(false);
        setIsUserNameError(false);
        setUserNameErrorMessage("");

        const regex = /^[가-힣]+$/;

        if (!userName.trim()) {
            setIsUserNameValid(false);
            setIsUserNameError(true);
            setUserNameErrorMessage("이름을 입력하여주세요.");
            return;
        }

        if (!regex.test(userName)) {
            setIsUserNameValid(false);
            setIsUserNameError(true);
            setUserNameErrorMessage("이름 형식이 올바르지 않습니다.");
            return;
        }

        setIsUserNameValid(true);
    };

    const handleValidatePhoneNumber = () => {
        setIsPhoneNumberValid(false);
        setIsPhoneNumberError(false);
        setPhoneNumberErrorMessage("");

        const regex = /^(010|011|016|017|018|019)-\d{3,4}-\d{4}$/;

        if (!phoneNumber.trim()) {
            setIsPhoneNumberValid(false);
            setIsPhoneNumberError(true);
            setPhoneNumberErrorMessage("휴대전화 번호를 입력해주세요.");
            return;
        }

        if (!regex.test(phoneNumber)) {
            setIsPhoneNumberValid(false);
            setIsPhoneNumberError(true);
            setPhoneNumberErrorMessage("휴대전화번호 형식이 올바르지 않습니다.");
            return;
        }

        setIsPhoneNumberValid(true);
    };

    const handleValidateEmail = () => {
        setIsEmailValid(false);
        setIsEmailError(false);
        setEmailErrorMessage("");

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email.trim()) {
            setIsEmailValid(false);
            setIsEmailError(true);
            setEmailErrorMessage("이메일을 입력하여주세요.");
            return;
        }

        if(!regex.test(email)) {
            setIsEmailValid(false);
            setIsEmailError(true);
            setEmailErrorMessage("이메일 형식이 올바르지 않습니다.");
            return;
        }

        setIsEmailValid(true);
    };

    const handleValidateAddress = () => {
        setIsAddressValid(false);
        setIsAddressError(false);
        setAddressErrorMessage("");

        if(!postalCode.trim() || !defaultAddress.trim()) {
            setIsAddressValid(false);
            setIsAddressError(true);
            setAddressErrorMessage("주소를 선택해주세요");
            return;
        }

        setIsAddressValid(true);
    }

    const handleValidateTotal = async () => {
        setIsLoading(true);
        setIsError(false);
        setErrorMessage("");

        await handleValidateUserId();
        handleValidatePassword();
        handleValidatePasswordCheck();
        handleValidateUserName();
        handleValidatePhoneNumber();
        handleValidateEmail();
        handleValidateAddress();

        if(isUserIdError || isPasswordError || isPasswordCheckError || isUserIdError || isPhoneNumberError || isEmailError || isAddressError) {
            setIsError(true);
            setErrorMessage("필수 조건 값을 확인하세요.");
            setIsLoading(false);
            return;
        }

        handleSignUpNative();
    }

    const handleSignUpNative = () => {
        const responseBody:NativeSignUpRequestDto = {
            userId:userId,
            password:password,
            userName:userName,
            phoneNumber:phoneNumber,
            email:email,
            postalCode:postalCode,
            defaultAddress:defaultAddress,
            detailAddress:detailAddress,
            extraAddress:extraAddress
        }

        setIsLoading(false);
        console.log("회원가입 시도", responseBody)
    }

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
                                <Form.Control.Feedback>
                                    {"사용 가능한 아이디입니다."}
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    {userIdErrorMessage}
                                </Form.Control.Feedback>
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
                                    onClick={handleChangePasswordType}
                                >
                                    {passwordType === "password" && <EyeOn />}
                                    {passwordType === "text" && <EyeOff />}
                                </Button>
                                <Form.Control.Feedback type="invalid">
                                    {passwordErrorMessage}
                                </Form.Control.Feedback>
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
                                    onClick={handleChangeCheckPasswordType}
                                >
                                    {checkPasswordType === "password" && <EyeOn />}
                                    {checkPasswordType === "text" && <EyeOff />}
                                </Button>
                                <Form.Control.Feedback>
                                    {"비밀번호가 일치합니다."}
                                </Form.Control.Feedback>
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
                                <Form.Control.Feedback type="invalid">
                                    {userNameErrorMessage}
                                </Form.Control.Feedback>
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
                                <Form.Control.Feedback type="invalid">
                                    {emailErrorMessage}
                                </Form.Control.Feedback>
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
                                            isValid={isAddressValid}
                                            isInvalid={isAddressError}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {addressErrorMessage}
                                        </Form.Control.Feedback>
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
                                    isValid={isAddressValid}
                                    isInvalid={isAddressError}
                                />
                            </InputGroup>
                        </Form.Group>

                        <Row className="mb-5">
                            <Form.Group as={Col} xs={6} controlId="signup-detailAddress">
                                <Form.Label>{"상세주소"}</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        ref={detailAddressRef}
                                        value={detailAddress}
                                        onChange={(e) => setDetailAddress(e.target.value)}
                                        placeholder="상세주소"
                                        isValid={isAddressValid}
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
                                        isValid={isAddressValid}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3">
                            {isError && (
                                <div className="invalid-feedback" style={{ display: "block" }}>
                                    {errorMessage}
                                </div>
                            )}
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button variant="primary" size="lg" onClick={handleValidateTotal}>
                                {"회원가입"}
                            </Button>
                        </div>
                    </Form>
                </Container>
            </div>
            {isLoading && <Loader />}
            <DaumPostCodeModal
                showDaumPostCodeModal={showDaumPostCodeModal}
                handleCloseDaumPostCodeModal={handleCloseDaumPostCodeModal}
                setPostalCode={setPostalCode}
                setDefaultAddress={setDefaultAddress}
                setExtraAddress={setExtraAddress}
                detailAddressRef={detailAddressRef}
            />
            <AlertModal
                showAlertModal={showAlertModal}
                handleCloseAlertModal={handleCloseAlertModal}
                alertTitle={alertTitle}
                alertText={alertText}
            />
        </>
    );
}
