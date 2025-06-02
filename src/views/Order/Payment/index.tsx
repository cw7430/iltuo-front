import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MAIN_PATH } from "../../../constants/url";
import { OrderGroupResponseDto } from "../../../apis/dto/response/Order";
import { Loader } from "../../../components/Gif";
import { AlertModal, ConfirmModal, DaumPostCodeModal } from "../../../components/Modals";
import { IdxRequestDto } from "../../../apis/dto/request";
import { fetchAddPayment, fetchDeleteOrder, fetchOrderData } from "../../../apis/server/Order";
import { ApiError } from "../../../apis/server";
import { logoutUser } from "../../../utils/auth";
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { fetchAddressList } from "../../../apis/server/Auth";
import { AddressResponseDto } from "../../../apis/dto/response/Auth";
import SearchExistAddressModal from "../../../components/Modals/SearchExistAddressModal";
import { TotalPriceCard } from "../../../components/Cards";
import { AddPaymentRequestDto } from "../../../apis/dto/request/Order";

function Payment() {
  const navigate = useNavigate();

  const { paymentId } = useParams<{ paymentId: string }>();

  const detailAddressRef = useRef<HTMLInputElement>(null);
  const cardNumber1Ref = useRef<HTMLInputElement>(null);
  const cardNumber2Ref = useRef<HTMLInputElement>(null);
  const cardNumber3Ref = useRef<HTMLInputElement>(null);
  const cardNumber4Ref = useRef<HTMLInputElement>(null);
  const cardExpiryRef = useRef<HTMLInputElement>(null);
  const cardCVCRef = useRef<HTMLInputElement>(null);
  const cardPasswordRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderGroup, setOrderGroup] = useState<OrderGroupResponseDto | undefined>(undefined);
  const [addressList, setAddressList] = useState<AddressResponseDto[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [addressMethod, setAddressMethod] = useState<"A" | "B" | "C">("C");
  const [postalCode, setPostalCode] = useState<string>("");
  const [defaultAddress, setDefaultAddress] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [extraAddress, setExtraAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"PM001" | "PM002" | "PM000">("PM000");
  const [cardNumber1, setCardNumber1] = useState<string>("");
  const [cardNumber2, setCardNumber2] = useState<string>("");
  const [cardNumber3, setCardNumber3] = useState<string>("");
  const [cardNumber4, setCardNumber4] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCVC, setCardCVC] = useState<string>("");
  const [cardPassword, setCardPassword] = useState<string>("");

  const [isAddressError, setIsAddressError] = useState<boolean>(false);
  const [isPaymentError, setIsPaymentError] = useState<boolean>(false);
  const [isCardNumberError, setIsCardNumberError] = useState<boolean>(false);
  const [isCardExpiryError, setIsCardExpiryError] = useState<boolean>(false);
  const [isCardCVCError, setIsCardCVCError] = useState<boolean>(false);
  const [isCardPasswordError, setIsCardPasswordError] = useState<boolean>(false);

  const [cardNumberErrorMessage, setCardNumberErrorMessage] = useState<string>("");
  const [cardExpirErrorMessage, setCardExpirErrorMessage] = useState<string>("");
  const [cardCVCErrorMessage, setCardCVCErrorMessage] = useState<string>("");
  const [cardPasswordErrorMessage, setCardPasswordErrorMessage] = useState<string>("");

  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertText, setAlertText] = useState<string>("");
  const [alertAction, setAlertAction] = useState<() => void>(() => {});

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmTitle, setConfirmTitle] = useState<string>("");
  const [confirmText, setConfirmText] = useState<string>("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

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

  const showGenericConfirmModal = (title: string, text: string, onConfirm: () => void) => {
    setConfirmTitle(title);
    setConfirmText(text);
    setConfirmAction(() => () => {
      onConfirm();
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  const handleConfirm = () => confirmAction();

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
        if (orderData.orderStatusCode !== "OS001") {
          showGenericAlertModal("경고", "접근하실 수 없는 페이지입니다.", () => {
            handleNavigateMainPath();
          });
        }
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

  const handleDeleteOrder = async () => {
    const requestBody: IdxRequestDto = {
      idx: Number(paymentId),
    };
    try {
      setIsLoading(true);
      fetchDeleteOrder(requestBody);
    } finally {
      setIsLoading(false);
      handleNavigateMainPath();
    }
  };

  const handleValidate = () => {
    setIsAddressError(false);
    setIsPaymentError(false);
    setIsCardNumberError(false);
    setIsCardExpiryError(false);
    setIsCardCVCError(false);
    setIsCardPasswordError(false);

    let isVaild: boolean = true;

    if (addressMethod === "C" || postalCode.trim() === "" || defaultAddress.trim() === "") {
      setIsAddressError(true);
      isVaild = false;
    }

    if (paymentMethod === "PM000") {
      setIsPaymentError(true);
      isVaild = false;
    }

    if (paymentMethod === "PM001") {
      const cardNumberRegex = /^\d{4}$/;
      const cardNumber4Regex = /^\d{3,4}$/;
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      const cvcRegex = /^\d{3}$/;

      if (
        !cardNumberRegex.test(cardNumber1) ||
        !cardNumberRegex.test(cardNumber2) ||
        !cardNumberRegex.test(cardNumber3) ||
        !cardNumber4Regex.test(cardNumber4)
      ) {
        setIsCardNumberError(true);
        setCardNumberErrorMessage("카드 번호 형식이 올바르지 않습니다.");
        isVaild = false;
      }

      if (
        cardNumber1.trim() === "" &&
        cardNumber2.trim() === "" &&
        cardNumber3.trim() === "" &&
        cardNumber4.trim() === ""
      ) {
        setIsCardNumberError(true);
        setCardNumberErrorMessage("카드 번호를 입력해주세요.");
        isVaild = false;
      }

      if (!expiryRegex.test(cardExpiry)) {
        setIsCardExpiryError(true);
        setCardExpirErrorMessage("카드 유효기간 형식이 옳바르지 않습니다.");
        isVaild = false;
      }

      if (cardExpiry.trim() === "") {
        setIsCardExpiryError(true);
        setCardExpirErrorMessage("카드 유효기간을 입력해주세요.");
        isVaild = false;
      }

      if (!cvcRegex.test(cardCVC)) {
        setIsCardCVCError(true);
        setCardCVCErrorMessage("CVC 형식이 옳바르지 않습니다.");
        isVaild = false;
      }

      if (cardCVC.trim() === "") {
        setIsCardCVCError(true);
        setCardCVCErrorMessage("CVC를 입력해주세요.");
        isVaild = false;
      }

      if (!cardNumberRegex.test(cardPassword)) {
        setIsCardPasswordError(true);
        setCardPasswordErrorMessage("카드 비밀번호 형식이 옳바르지 않습니다.");
        isVaild = false;
      }

      if (cardPassword.trim() === "") {
        setIsCardPasswordError(true);
        setCardPasswordErrorMessage("카드 비밀번호를 입력해주세요.");
        isVaild = false;
      }
    }

    if (!isVaild) return;

    handlePay();
  };

  const handlePay = () => {
    showGenericConfirmModal("확인", "상품을 구매하시겠습니까?", async () => {
      if (!orderGroup) return;

      if (paymentMethod === "PM000") return;

      const orderIds: IdxRequestDto[] = orderGroup.orders.map((order) => ({ idx: order.orderId }));

      const requestBody: AddPaymentRequestDto = {
        paymentId: Number(paymentId),
        paymentMethodCode: paymentMethod,
        postalCode: postalCode,
        defaultAddress: defaultAddress,
        detailAddress: detailAddress,
        extraAddress: extraAddress,
        orderIds: orderIds,
      };

      try {
        setIsLoading(true);
        const response = await fetchAddPayment(requestBody);
        if (response) {
          showGenericAlertModal("완료", "구매가 완료되었습니다.", () => {
            handleNavigateMainPath();
          });
        }
      } catch (e) {
        if (e instanceof ApiError) {
          if (e.code === "UA") {
            showGenericAlertModal("세션만료", "세션이 만료되었습니다. 로그아웃합니다.", () => {
              logoutUser();
            });
          } else if (e.code === "FB") {
            showGenericAlertModal("경고", "권한이 없습니다.", () => {
              handleNavigateMainPath();
            });
          } else {
            showGenericAlertModal("오류", "서버 오류입니다. 나중에 다시 시도하세요.", () => {});
          }
        } else {
          showGenericAlertModal("오류", "서버 오류입니다. 나중에 다시 시도하세요.", () => {});
        }
      } finally {
        setIsLoading(false);
      }
    });
  };

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
              <Card.Header>
                <h4>{"결제"}</h4>
              </Card.Header>
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
                      checked={addressMethod === "B" || addressList.length < 1}
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
                      {"주소를 입력하여주세요."}
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
                  <Form.Group as={Col} className="mb-2">
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
                  <Form.Group className="mb-2" controlId="payment-method">
                    <Form.Label>{"결제방식"}</Form.Label>
                    <InputGroup>
                      <Form.Check
                        type="radio"
                        label="신용카드"
                        value="PM001"
                        checked={paymentMethod === "PM001"}
                        onChange={() => setPaymentMethod("PM001")}
                        isInvalid={isPaymentError}
                      />
                      <Form.Check
                        type="radio"
                        className="ms-4"
                        label="무통장 입금"
                        value="PM002"
                        checked={paymentMethod === "PM002"}
                        onChange={() => setPaymentMethod("PM002")}
                        isInvalid={isPaymentError}
                      />
                    </InputGroup>
                    {isPaymentError && (
                      <div className="invalid-feedback" style={{ display: "block" }}>
                        {"결제 방식을 선택하여주세요."}
                      </div>
                    )}
                  </Form.Group>
                  {paymentMethod === "PM001" && (
                    <>
                      <Form.Group className="mb-2" controlId="card-number">
                        <Form.Label>{"카드번호"}</Form.Label>
                        <InputGroup as={Row}>
                          <Col>
                            <Form.Control
                              type="text"
                              ref={cardNumber1Ref}
                              maxLength={4}
                              value={cardNumber1}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setCardNumber1(value);
                                if (!cardNumber2Ref.current) return;
                                if (value.length === 4) cardNumber2Ref.current.focus();
                              }}
                              isInvalid={isCardNumberError}
                            />
                          </Col>
                          <Col>
                            <Form.Control
                              type="password"
                              ref={cardNumber2Ref}
                              maxLength={4}
                              value={cardNumber2}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setCardNumber2(value);
                                if (!cardNumber3Ref.current) return;
                                if (value.length === 4) cardNumber3Ref.current.focus();
                              }}
                              onKeyDown={(e) => {
                                if (!cardNumber1Ref.current) return;
                                if (e.key === "Backspace" && cardNumber2.length === 0) {
                                  cardNumber1Ref.current.focus();
                                }
                              }}
                              isInvalid={isCardNumberError}
                            />
                          </Col>
                          <Col>
                            <Form.Control
                              type="password"
                              ref={cardNumber3Ref}
                              maxLength={4}
                              value={cardNumber3}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setCardNumber3(value);
                                if (!cardNumber4Ref.current) return;
                                if (value.length === 4) cardNumber4Ref.current.focus();
                              }}
                              onKeyDown={(e) => {
                                if (!cardNumber2Ref.current) return;
                                if (e.key === "Backspace" && cardNumber3.length === 0) {
                                  cardNumber2Ref.current.focus();
                                }
                              }}
                              isInvalid={isCardNumberError}
                            />
                          </Col>
                          <Col>
                            <Form.Control
                              type="text"
                              ref={cardNumber4Ref}
                              maxLength={4}
                              value={cardNumber4}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setCardNumber4(value);
                                if (!cardExpiryRef.current) return;
                                if (value.length === 4) cardExpiryRef.current.focus();
                              }}
                              onKeyDown={(e) => {
                                if (!cardNumber3Ref.current) return;
                                if (e.key === "Backspace" && cardNumber4.length === 0) {
                                  cardNumber3Ref.current.focus();
                                }
                              }}
                              isInvalid={isCardNumberError}
                            />
                          </Col>
                        </InputGroup>
                        <Row>
                          <Col>
                            {isCardNumberError && (
                              <div className="invalid-feedback" style={{ display: "block" }}>
                                {cardNumberErrorMessage}
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Form.Group>
                      <Form.Group className="mb-2" controlId="card-expiry">
                        <Form.Label>{"유효기간"}</Form.Label>
                        <InputGroup as={Row} style={{ width: "150px" }}>
                          <Col>
                            <Form.Control
                              type="text"
                              ref={cardExpiryRef}
                              maxLength={5}
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => {
                                let input = e.target.value.replace(/\D/g, "");

                                if (input.length >= 2) {
                                  let month = parseInt(input.substring(0, 2), 10);
                                  if (month > 12) month = 12;
                                  const monthStr = month.toString().padStart(2, "0");

                                  if (input.length > 2) {
                                    const year = input.substring(2, 4);
                                    setCardExpiry(`${monthStr}/${year}`);
                                  } else {
                                    setCardExpiry(`${monthStr}`);
                                  }
                                } else {
                                  setCardExpiry(input);
                                }
                                if (!cardCVCRef.current) return;
                                if (!cardExpiryRef.current) return;
                                if (cardExpiryRef.current.value.length === 5) {
                                  cardCVCRef.current.focus();
                                }
                              }}
                              onKeyDown={(e) => {
                                if (!cardNumber4Ref.current) return;
                                if (e.key === "Backspace" && cardExpiry.length === 0) {
                                  cardNumber4Ref.current.focus();
                                }
                              }}
                              isInvalid={isCardExpiryError}
                            />
                          </Col>
                        </InputGroup>
                        <Row>
                          <Col>
                            {isCardExpiryError && (
                              <div className="invalid-feedback" style={{ display: "block" }}>
                                {cardExpirErrorMessage}
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Form.Group>
                      <Form.Group className="mb-2" controlId="card-CVC">
                        <Form.Label>{"CVC"}</Form.Label>
                        <InputGroup as={Row} style={{ width: "150px" }}>
                          <Col>
                            <Form.Control
                              type="password"
                              ref={cardCVCRef}
                              value={cardCVC}
                              maxLength={3}
                              placeholder="CVC"
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setCardCVC(value);
                                if (!cardPasswordRef.current) return;
                                if (value.length === 3) cardPasswordRef.current.focus();
                              }}
                              onKeyDown={(e) => {
                                if (!cardExpiryRef.current) return;
                                if (e.key === "Backspace" && cardCVC.length === 0) {
                                  cardExpiryRef.current.focus();
                                }
                              }}
                              isInvalid={isCardCVCError}
                            />
                          </Col>
                        </InputGroup>
                        <Row>
                          <Col>
                            {isCardCVCError && (
                              <div className="invalid-feedback" style={{ display: "block" }}>
                                {cardCVCErrorMessage}
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Form.Group>
                      <Form.Group className="mb-4" controlId="card-password">
                        <Form.Label>{"비밀번호"}</Form.Label>
                        <InputGroup as={Row} style={{ width: "150px" }}>
                          <Col>
                            <Form.Control
                              type="password"
                              ref={cardPasswordRef}
                              value={cardPassword}
                              maxLength={4}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setCardPassword(value);
                              }}
                              onKeyDown={(e) => {
                                if (!cardCVCRef.current) return;
                                if (e.key === "Backspace" && cardPassword.length === 0) {
                                  cardCVCRef.current.focus();
                                }
                              }}
                              isInvalid={isCardPasswordError}
                            />
                          </Col>
                        </InputGroup>
                        <Row>
                          <Col>
                            {isCardPasswordError && (
                              <div className="invalid-feedback" style={{ display: "block" }}>
                                {cardPasswordErrorMessage}
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Form.Group>
                    </>
                  )}
                  {paymentMethod === "PM002" && (
                    <>
                      <h5>
                        <strong>{"무통장입금 안내"}</strong>
                      </h5>
                      <p>
                        <strong>{"은행명:"}</strong>
                        {"신한은행"}
                      </p>
                      <p>
                        <strong>{"계좌번호:"}</strong>
                        {"110-456-789123"}
                      </p>
                      <p>
                        <strong>{"입금자명"}</strong>
                        {"최사장"}
                      </p>
                      <p>{"입금하실 계좌번호는 주문 목록에서 다시 확인하실 수 있습니다."}</p>
                    </>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <TotalPriceCard
              type="payment"
              totalPrice={totalPrice}
              handleDeleteOrder={handleDeleteOrder}
              handleValidate={handleValidate}
            />
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
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        handleCloseConfirmModal={handleCloseConfirmModal}
        handleConfirm={handleConfirm}
        confirmTitle={confirmTitle}
        confirmText={confirmText}
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
