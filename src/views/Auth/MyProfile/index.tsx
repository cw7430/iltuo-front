import { useCallback, useEffect, useState } from "react";
import {
  AddressResponseDto,
  NativeUserResponseDto,
  SocialUserResponseDto,
} from "../../../apis/dto/response/Auth";
import {
  fetchNativeProfile,
  fetchSocialProfile,
  fetchAddressList,
  fetchCangeMainAddress,
  fetchInvalidateAddress,
} from "../../../apis/server/Auth";
import { useAuthStore } from "../../../stores";
import { logoutUser } from "../../../utils/auth";
import { ApiError } from "../../../apis/server";
import {
  AlertModal,
  ConfirmModal,
  ChangePasswordModal,
  ChangeProfileModal,
} from "../../../components/Modals";
import { Loader } from "../../../components/Gif";
import { Button, Card, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import { convertAuthProvider, convertUtcToLocalDate } from "../../../utils/convert";
import { AddressFormCard } from "../../../components/Cards";
import { IdxRequestDto } from "../../../apis/dto/request";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH } from "../../../constants/url";

export default function MyProfile() {
  const navigate = useNavigate();

  const authMethod = useAuthStore((state) => state.authMethod);

  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<NativeUserResponseDto | SocialUserResponseDto | undefined>(
    undefined
  );
  const [addressList, setAddressList] = useState<AddressResponseDto[]>([]);
  const [checkedAddress, setCheckedAddress] = useState<number[]>([]);

  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);

  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertText, setAlertText] = useState<string>("");
  const [alertAction, setAlertAction] = useState<() => void>(() => {});

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmTitle, setConfirmTitle] = useState<string>("");
  const [confirmText, setConfirmText] = useState<string>("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  const [showChangePasswordModal, setShowChangePasswordModal] = useState<boolean>(false);

  const [showChangeProfileModal, setShowChangeProfileModal] = useState<boolean>(false);

  const handleNavigateMainPath = useCallback(() => {
    navigate(MAIN_PATH());
  }, [navigate]);

  const showGenericAlertModal = (title: string, text: string, onAlert: () => void) => {
    setAlertTitle(title);
    setAlertText(text);
    setAlertAction(() => () => {
      onAlert();
      setShowAlertModal(false);
    });
    setShowAlertModal(true);
  };

  const handleAfterAlert = () => alertAction();

  const handleCloseAlertModal = () => setShowAlertModal(false);

  const handleShowConfirmModal = (title: string, text: string, onConfirm: () => void) => {
    setConfirmTitle(title);
    setConfirmText(text);
    setConfirmAction(() => () => {
      onConfirm();
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  const handleConfirm = () => confirmAction();

  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  const handleCheck = (addressId: number, checked: boolean) => {
    setCheckedAddress((prev) =>
      checked ? [...prev, addressId] : prev.filter((id) => id !== addressId)
    );
  };

  const handleShowChangePasswordModal = () => setShowChangePasswordModal(true);

  const handleCloseChangePasswordModal = () => setShowChangePasswordModal(false);

  const handleShowChangeProfileModal = () => setShowChangeProfileModal(true);

  const handleCloseChangeProfileModal = () => setShowChangeProfileModal(false);

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
          showGenericAlertModal("세션만료", "세션이 만료되었습니다. 로그아웃합니다.", () => {
            logoutUser();
          });
        } else {
          showGenericAlertModal("오류", "서버 오류입니다. 나중에 다시 시도하세요.", () => {
            handleNavigateMainPath();
          });
        }
      } else {
        showGenericAlertModal("오류", "서버 오류입니다. 나중에 다시 시도하세요.", () => {
          handleNavigateMainPath();
        });
      }
    } finally {
      setLoading(false);
    }
  }, [authMethod, handleNavigateMainPath]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const handleChangeMainAddress = async (addressId: number) => {
    handleShowConfirmModal("확인", "메인주소를 변경하시겠습니까?", async () => {
      setLoading(true);
      const requestBody: IdxRequestDto = { idx: addressId };

      try {
        const response = await fetchCangeMainAddress(requestBody);
        if (response.success) {
          showGenericAlertModal("완료", "메인주소가 변경되었습니다.", () => {});
          await fetchUserInfo();
        }
      } catch (e) {
        if (e instanceof ApiError) {
          if (e.code === "UA") {
            showGenericAlertModal("세션만료", "세션이 만료되었습니다. 로그아웃합니다.", () => {
              logoutUser();
            });
          } else {
            showGenericAlertModal("오류", "서버 오류입니다. 나중에 다시 시도하세요.", () => {});
          }
        }
      } finally {
        setLoading(false);
      }
    });
  };

  const handleDeleteAddress = async (addressIds: number[], type: "SINGLE" | "MULTIPLE") => {
    handleShowConfirmModal(
      "확인",
      `${type === "MULTIPLE" ? "선택한 주소들을" : "주소를"} 삭제하시겠습니까?`,
      async () => {
        setLoading(true);
        if (type === "MULTIPLE" && checkedAddress.length < 1) {
          showGenericAlertModal("경고", "체크된 주소가 없습니다.", () => {});
          return;
        }
        const responseBody: IdxRequestDto[] = addressIds.map((idx) => ({ idx: idx }));
        try {
          const response = await fetchInvalidateAddress(responseBody);
          if (response.success) {
            showGenericAlertModal(
              "완료",
              `${type === "MULTIPLE" ? "선택한 주소들이" : "주소가"} 삭제되었습니다.`,
              () => {}
            );

            setCheckedAddress([]);

            await fetchUserInfo();
          }
        } catch (e) {
          if (e instanceof ApiError) {
            if (e.code === "UA") {
              showGenericAlertModal("세션만료", "세션이 만료되었습니다. 로그아웃합니다.", () => {
                logoutUser();
              });
            } else {
              showGenericAlertModal("오류", "서버 오류입니다. 나중에 다시 시도하세요.", () => {
                handleNavigateMainPath();
              });
            }
          }
        } finally {
          setLoading(false);
        }
      }
    );
  };

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
            <Col md={6} className="mb-4" style={{ minWidth: "480px", maxWidth: "600px" }}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">{"프로필 정보"}</h5>
                </Card.Header>
                <Card.Body>
                  {profile &&
                    (authMethod === "NATIVE" ? (
                      <p>
                        <strong>{"아이디: "}</strong> {"userId" in profile ? profile.userId : ""}
                      </p>
                    ) : (
                      <p>
                        <strong>{"인증 수단: "}</strong>{" "}
                        {"authProvider" in profile ? convertAuthProvider(profile.authProvider) : ""}
                      </p>
                    ))}
                  <p>
                    <strong>{"이름: "}</strong> {profile?.userName}
                  </p>
                  <p>
                    <strong>{"이메일: "}</strong> {profile?.email}
                  </p>
                  <p>
                    <strong>{"전화번호: "}</strong> {profile?.phoneNumber}
                  </p>
                  <p>
                    <strong>{"가입일: "}</strong>
                    {profile?.registerDate ? convertUtcToLocalDate(profile.registerDate) : ""}
                  </p>
                </Card.Body>
                {authMethod === "NATIVE" && (
                  <Card.Footer>
                    <Row className="text-end">
                      <Col>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={handleShowChangeProfileModal}
                        >
                          {"회원정보 변경"}
                        </Button>

                        <Button
                          type="button"
                          variant="danger"
                          className="ms-2"
                          onClick={handleShowChangePasswordModal}
                        >
                          {"비밀번호 변경"}
                        </Button>
                      </Col>
                    </Row>
                  </Card.Footer>
                )}
              </Card>
            </Col>

            {/* 배송지 목록 카드 */}
            <Col md={6} className="mb-4" style={{ minWidth: "480px", maxWidth: "600px" }}>
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
                            <Col xs={1} className="d-flex align-items-center">
                              <Form.Check
                                type="checkbox"
                                value={addr.addressId}
                                checked={checkedAddress.includes(addr.addressId)}
                                onChange={(e) => handleCheck(addr.addressId, e.target.checked)}
                              />
                            </Col>
                            <Col xs={6}>
                              {addr.main && (
                                <span className="badge bg-danger mb-1">{"메인 주소"}</span>
                              )}
                              <div>{addr.postalCode}</div>
                              <div>
                                {addr.defaultAddress} {addr.detailAddress}
                              </div>
                              <div>{addr.extraAddress}</div>
                            </Col>
                            <Col xs={5} className="d-flex align-items-center justify-content-end">
                              {!addr.main && (
                                <Button
                                  type="button"
                                  variant="warning"
                                  onClick={() => handleChangeMainAddress(addr.addressId)}
                                >
                                  {"메인지정"}
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="danger"
                                className="ms-2"
                                onClick={() => handleDeleteAddress([addr.addressId], "SINGLE")}
                              >
                                {"삭제"}
                              </Button>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
                <Card.Footer>
                  <Row className="text-end">
                    <Col>
                      {addressList.length < 5 && (
                        <Button
                          type="button"
                          variant={showAddressForm ? "danger" : "primary"}
                          onClick={() => setShowAddressForm((prev) => !prev)}
                        >
                          {showAddressForm ? "취소" : "주소추가"}
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="danger"
                        className="ms-2"
                        onClick={() => handleDeleteAddress(checkedAddress, "MULTIPLE")}
                      >
                        {"선택삭제"}
                      </Button>
                    </Col>
                  </Row>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
          {showAddressForm && (
            <Row className="justify-content-center">
              <Col className="mt-3" style={{ minWidth: "480px", maxWidth: "600px" }}>
                <AddressFormCard
                  setShowAddressForm={setShowAddressForm}
                  updateData={fetchUserInfo}
                />
              </Col>
            </Row>
          )}
        </Container>
      </div>
      {loading && <Loader />}
      <AlertModal
        showAlertModal={showAlertModal}
        handleCloseAlertModal={handleCloseAlertModal}
        handleAfterAlert={handleAfterAlert}
        alertTitle={alertTitle}
        alertText={alertText}
      />
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        handleCloseConfirmModal={handleCloseConfirmModal}
        handleConfirm={handleConfirm}
        confirmTitle={confirmTitle}
        confirmText={confirmText}
      />
      {authMethod === "NATIVE" && (
        <ChangePasswordModal
          showChangePasswordModal={showChangePasswordModal}
          handleCloseChangePasswordModal={handleCloseChangePasswordModal}
        />
      )}
      {authMethod === "NATIVE" && profile && (
        <ChangeProfileModal
          showChangeProfileModal={showChangeProfileModal}
          handleCloseChangeProfileModal={handleCloseChangeProfileModal}
          updateData={fetchUserInfo}
          userId={profile.userId}
          userName={profile.userName}
          phoneNumber={profile.phoneNumber}
          email={profile.email}
        />
      )}
    </>
  );
}
