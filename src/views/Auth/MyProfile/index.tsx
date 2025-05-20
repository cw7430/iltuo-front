import React, { useCallback, useEffect, useState } from "react";
import {
    AddressResponseDto,
    NativeUserResponseDto,
    SocialUserResponseDto,
} from "../../../apis/dto/response/Auth";
import { useNavigate } from "react-router-dom";
import {
    fetchNativeProfile,
    fetchSocialProfile,
    fetchAddressList,
} from "../../../apis/server/Auth";
import { useAuthStore } from "../../../stores";
import { logoutUser } from "../../../utils/auth";
import { ApiError } from "../../../apis/server";
import { MAIN_PATH } from "../../../constants/url";
import { AlertModal } from "../../../components/Modals";
import { Loader } from "../../../components/Gif";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";

export default function MyProfile() {
    const navigate = useNavigate();

    const authMethod = useAuthStore((state) => state.authMethod);

    const [loading, setLoading] = useState<boolean>(false);
    const [profile, setProfile] = useState<
        NativeUserResponseDto | SocialUserResponseDto | undefined
    >(undefined);
    const [addressList, setAddressList] = useState<AddressResponseDto[]>([]);

    const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
    const [alertTitle, setAlertTitle] = useState<string>("");
    const [alertText, setAlertText] = useState<string>("");

    const handleShowAlertModal = (title: string, text: string) => {
        setAlertTitle(title);
        setAlertText(text);
        setShowAlertModal(true);
    };
    const handleCloseAlertModal = () => {
        setShowAlertModal(false);
        navigate(MAIN_PATH());
    };

    const fetchUserInfo = useCallback(async () => {
        setLoading(true);

        try {
            let profileData;

            if (authMethod === "NATIVE") {
                profileData = await fetchNativeProfile();
            } else if (authMethod === "SOCIAL") {
                profileData = await fetchSocialProfile();
            } else {
                throw new Error("Invalid auth method");
            }

            const addressData = await fetchAddressList();

            setProfile(profileData);
            setAddressList(addressData);
        } catch (e) {
            if (e instanceof ApiError) {
                if (e.code === "UA") {
                    handleShowAlertModal("세션만료", "세션이 만료되었습니다. 로그아웃합니다.");
                    logoutUser();
                } else {
                    handleShowAlertModal(
                        "서버 오류",
                        "서버 오류가 발생했습니다. 나중에 다시 시도하세요."
                    );
                }
            } else {
                handleShowAlertModal(
                    "서버 오류",
                    "서버 오류가 발생했습니다. 나중에 다시 시도하세요."
                );
            }
        } finally {
            setLoading(false);
        }
    }, [authMethod]);

    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

    return (
        <>
            <div className="coffee_section layout_padding">
                <Container>
                    <Row>
                        <Col md={12}>
                            <h1 className="coffee_taital">{"내 프로필"}</h1>
                        </Col>
                    </Row>
                </Container>
                <Container className="py-5">
                    <Row className="justify-content-center">
                        {/* 프로필 정보 카드 */}
                        <Col md={6} className="mb-4" style={{minWidth:"480px", maxWidth:"600px"}}>
                            <Card>
                                <Card.Header>
                                    <h5 className="mb-0">{"프로필 정보"}</h5>
                                </Card.Header>
                                <Card.Body>
                                    <p>
                                        <strong>{"이름: "}</strong> {profile?.userName}
                                    </p>
                                    <p>
                                        <strong>{"아이디: "}</strong> {profile?.userId}
                                    </p>
                                    <p>
                                        <strong>{"이메일: "}</strong> {profile?.email}
                                    </p>
                                    <p>
                                        <strong>{"전화번호: "}</strong> {profile?.phoneNumber}
                                    </p>
                                    <p>
                                        <strong>{"가입일: "}</strong>
                                        {profile?.registerDate
                                            ? new Date(profile.registerDate)
                                                  .toLocaleDateString("ko-KR", {
                                                      year: "numeric",
                                                      month: "2-digit",
                                                      day: "2-digit",
                                                  })
                                                  .replaceAll(". ", "-")
                                                  .replace(".", "")
                                            : ""}
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* 배송지 목록 카드 */}
                        <Col md={6} className="mb-4" style={{minWidth:"480px" , maxWidth:"600px"}}>
                            <Card>
                                <Card.Header>
                                    <h5 className="mb-0">{"배송지 목록"}</h5>
                                </Card.Header>
                                <Card.Body>
                                    {addressList.length === 0 ? (
                                        <p className="text-muted">{"등록된 주소가 없습니다."}</p>
                                    ) : (
                                        <ListGroup variant="flush">
                                            {addressList.map((addr, idx) => (
                                                <ListGroup.Item key={idx} className="py-2">
                                                    <Row>
                                                        <Col
                                                            xs={1}
                                                            className="d-flex align-items-center"
                                                        >
                                                            {"체크"}
                                                        </Col>
                                                        <Col xs={6}>
                                                            {addr.main && (
                                                                <span className="badge bg-danger mb-1">
                                                                    {"메인 주소"}
                                                                </span>
                                                            )}
                                                            <div>{addr.postalCode}</div>
                                                            <div>
                                                                {addr.defaultAddress}{" "}
                                                                {addr.detailAddress}
                                                            </div>
                                                            <div>{addr.extraAddress}</div>
                                                        </Col>
                                                        <Col
                                                            xs={5}
                                                            className="d-flex align-items-center justify-content-end"
                                                        >
                                                            {!addr.main && (
                                                                <Button
                                                                    type="button"
                                                                    variant="warning"
                                                                >
                                                                    {"메인지정"}
                                                                </Button>
                                                            )}
                                                            <Button
                                                                type="button"
                                                                variant="danger"
                                                                className="ms-2"
                                                            >
                                                                {"삭제"}
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                    {idx + 1 < addressList.length && <hr />}
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    )}
                                </Card.Body>
                                <Card.Footer>
                                    <Row className="text-end">
                                        <Col>
                                            {addressList.length < 5 && (
                                                <Button type="button" variant="primary">
                                                    {"주소추가"}
                                                </Button>
                                            )}
                                            <Button type="button" variant="danger" className="ms-2">
                                                {"선택삭제"}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            {loading && <Loader />}
            <AlertModal
                showAlertModal={showAlertModal}
                handleCloseAlertModal={handleCloseAlertModal}
                alertTitle={alertTitle}
                alertText={alertText}
            />
        </>
    );
}
