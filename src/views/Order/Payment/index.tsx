import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MAIN_PATH } from "../../../constants/url";
import { OrderGroupResponseDto } from "../../../apis/dto/response/Order";
import { Loader } from "../../../components/Gif";
import { AlertModal, DaumPostCodeModal } from "../../../components/Modals";
import { IdxRequestDto } from "../../../apis/dto/request";
import { fetchOrderData } from "../../../apis/server/Order";
import { ApiError } from "../../../apis/server";
import { logoutUser } from "../../../utils/auth";
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { fetchAddressList } from "../../../apis/server/Auth";
import { AddressResponseDto } from "../../../apis/dto/response/Auth";
import SearchExistAddressModal from "../../../components/Modals/SearchExistAddressModal";

function Payment() {
  const navigate = useNavigate();

  const { paymentId } = useParams<{ paymentId: string }>();

  const detailAddressRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderGroup, setOrderGroup] = useState<OrderGroupResponseDto | undefined>(undefined);
  const [addressList, setAddressList] = useState<AddressResponseDto[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [addressMethod, setAddressMethod] = useState<"A" | "B" | "C">("C");
  const [postalCode, setPostalCode] = useState<string>("");
  const [defaultAddress, setDefaultAddress] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [extraAddress, setExtraAddress] = useState<string>("");

  const [isAddressError, setIsAddressError] = useState<boolean>(false);

  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertText, setAlertText] = useState<string>("");
  const [alertAction, setAlertAction] = useState<() => void>(() => {});

  const [showSearchExistAddressModal, setShowSearchExistAddressModal] = useState<boolean>(false);

  const [showDaumPostCodeModal, setShowDaumPostCodeModal] = useState<boolean>(false);

  const showGenericAlertModal = (title: string, text: string, onAlert: () => void) => {
    setAlertTitle(title);
    setAlertText(text);
    setAlertAction(() => () => {
      onAlert();
      setShowAlertModal(false);
    });
    setShowAlertModal(true);
  };

  const handleCloseAlertModal = () => setShowAlertModal(false);

  const handleAfterAlert = () => alertAction();

  const handleSearchAddress = () => {
    if (addressMethod === "C") return;
    if (addressMethod === "A") {
      setShowSearchExistAddressModal(true);
      return;
    }
    if (addressMethod === "B") {
      setShowDaumPostCodeModal(true);
      return;
    }
  };

  const handleCloseSearchExistAddressModal = () => setShowSearchExistAddressModal(false);

  const handleCloseDaumPostCodeModal = () => setShowDaumPostCodeModal(false);

  const handleNavigateMainPath = useCallback(() => {
    navigate(MAIN_PATH());
  }, [navigate]);

  useEffect(() => {
    setPostalCode("");
    setDefaultAddress("");
    setDetailAddress("");
    setExtraAddress("");
  }, [addressMethod]);

  useEffect(() => {
    if (!paymentId || isNaN(Number(paymentId))) {
      showGenericAlertModal("오류", "접근하실 수 없는 페이지입니다.", () => {
        handleNavigateMainPath();
      });
    }

    const fetchData = async () => {
      setIsLoading(true);
      const requestBody: IdxRequestDto = {
        idx: Number(paymentId),
      };
      try {
        const orderData = await fetchOrderData(requestBody);
        const addressData = await fetchAddressList();
        const sum = orderData.orders.reduce((sum, order) => sum + order.price, 0);
        setOrderGroup(orderData);
        setAddressList(addressData);
        setTotalPrice(sum);
      } catch (e) {
        if (e instanceof ApiError) {
          if (e.code === "UA") {
            showGenericAlertModal("세션만료", "세션이 만료되었습니다. 로그아웃합니다.", () => {
              logoutUser();
            });
          } else if (e.code === "FB") {
            showGenericAlertModal("경고", "접근하실 수 없는 페이지입니다.", () => {
              handleNavigateMainPath();
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
        setIsLoading(false);
      }
    };

    fetchData();
  }, [paymentId, handleNavigateMainPath]);

  useEffect(() => {
    if (totalPrice >= 50000) {
      setDeliveryPrice(0);
    } else {
      const remaining = 50000 - totalPrice;
      setDeliveryPrice(Math.min(remaining, 3000));
    }
  }, [totalPrice]);

  return (
    <>
      <Container className="py-5">
        <Row className="justify-content-md-center">
          <Col className="mt-5 text-center">
            <h1 className="mb-4">{"결제"}</h1>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col lg={8}>
            <Card>
              <Card.Header as="h4">{"결제"}</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3" controlId="payment-address-method">
                  <Form.Label>{"주소"}</Form.Label>
                  <InputGroup>
                    {addressList.length > 0 && (
                      <Form.Check
                        type="radio"
                        label="등록된 주소"
                        value="A"
                        checked={addressMethod === "A"}
                        onChange={() => setAddressMethod("A")}
                        isInvalid={isAddressError}
                      />
                    )}
                    <Form.Check
                      type="radio"
                      className="ms-4"
                      label="등록 되지 않은 주소"
                      value="B"
                      checked={addressMethod === "B"}
                      onChange={() => setAddressMethod("B")}
                      isInvalid={isAddressError}
                    />
                  </InputGroup>
                </Form.Group>
                <Row className="mb-2">
                  <Col style={{ maxWidth: "200px" }}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="우편번호"
                        isInvalid={isAddressError}
                        readOnly={true}
                        disabled={addressMethod === "C"}
                      />
                    </InputGroup>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={handleSearchAddress}
                      disabled={addressMethod === "C"}
                    >
                      {"주소 검색"}
                    </Button>
                  </Col>
                </Row>
                <Form.Group className="mb-2">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={defaultAddress}
                      onChange={(e) => setDefaultAddress(e.target.value)}
                      placeholder="주소"
                      isInvalid={isAddressError}
                      readOnly={true}
                      disabled={addressMethod === "C"}
                    />
                    <Form.Control.Feedback type="invalid">
                      {"주소를 입력하여주세요"}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        ref={detailAddressRef}
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        placeholder="상세 주소"
                        readOnly={addressMethod === "A"}
                        disabled={addressMethod === "C"}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={extraAddress}
                        onChange={(e) => setExtraAddress(e.target.value)}
                        placeholder="참고 항목"
                        readOnly={true}
                        disabled={addressMethod === "C"}
                      />
                    </InputGroup>
                  </Form.Group>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card>
              <Card.Header as="h4">{"결제 정보"}</Card.Header>
              <Card.Body>
                <p>
                  <strong>{"총 상품금액:"}</strong>
                  {` ${totalPrice.toLocaleString()} 원`}
                </p>
                <p>
                  <strong>{"배송비:"}</strong>
                  {` ${deliveryPrice.toLocaleString()} 원`}
                </p>
                <p>
                  <strong>{"총 결제금액:"}</strong>
                  {` ${(totalPrice + deliveryPrice).toLocaleString()} 원`}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {isLoading && <Loader />}
      <AlertModal
        showAlertModal={showAlertModal}
        alertTitle={alertTitle}
        alertText={alertText}
        handleCloseAlertModal={handleCloseAlertModal}
        handleAfterAlert={handleAfterAlert}
      />
      <SearchExistAddressModal
        showSearchExistAddressModal={showSearchExistAddressModal}
        handleCloseSearchExistAddressModal={handleCloseSearchExistAddressModal}
        addressList={addressList}
        setPostalCode={setPostalCode}
        setDefaultAddress={setDefaultAddress}
        setDetailAddress={setDetailAddress}
        setExtraAddress={setExtraAddress}
      />
      <DaumPostCodeModal
        showDaumPostCodeModal={showDaumPostCodeModal}
        handleCloseDaumPostCodeModal={handleCloseDaumPostCodeModal}
        setPostalCode={setPostalCode}
        setDefaultAddress={setDefaultAddress}
        setDetailAddress={setDetailAddress}
        setExtraAddress={setExtraAddress}
        detailAddressRef={detailAddressRef}
      />
    </>
  );
}

export default Payment;
