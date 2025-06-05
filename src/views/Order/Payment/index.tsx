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
import { Container, Row, Col } from "react-bootstrap";
import { fetchAddressList } from "../../../apis/server/Auth";
import { AddressResponseDto } from "../../../apis/dto/response/Auth";
import SearchExistAddressModal from "../../../components/Modals/SearchExistAddressModal";
import { PaymentCard, TotalPriceCard } from "../../../components/Cards";
import { AddPaymentRequestDto } from "../../../apis/dto/request/Order";

export default function Payment() {
  const navigate = useNavigate();

  const { paymentId } = useParams<{ paymentId: string }>();

  const detailAddressRef = useRef<HTMLInputElement>(null);

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
            <PaymentCard
              addressList={addressList}
              addressMethod={addressMethod}
              postalCode={postalCode}
              defaultAddress={defaultAddress}
              detailAddress={detailAddress}
              extraAddress={extraAddress}
              paymentMethod={paymentMethod}
              cardNumber1={cardNumber1}
              cardNumber2={cardNumber2}
              cardNumber3={cardNumber3}
              cardNumber4={cardNumber4}
              cardExpiry={cardExpiry}
              cardCVC={cardCVC}
              cardPassword={cardPassword}
              isAddressError={isAddressError}
              isPaymentError={isPaymentError}
              isCardNumberError={isCardNumberError}
              isCardExpiryError={isCardExpiryError}
              isCardCVCError={isCardCVCError}
              isCardPasswordError={isCardPasswordError}
              cardNumberErrorMessage={cardNumberErrorMessage}
              cardExpirErrorMessage={cardExpirErrorMessage}
              cardCVCErrorMessage={cardCVCErrorMessage}
              cardPasswordErrorMessage={cardPasswordErrorMessage}
              detailAddressRef={detailAddressRef}
              setAddressMethod={setAddressMethod}
              setPostalCode={setPostalCode}
              setDefaultAddress={setDefaultAddress}
              setDetailAddress={setDetailAddress}
              setExtraAddress={setExtraAddress}
              setPaymentMethod={setPaymentMethod}
              setCardNumber1={setCardNumber1}
              setCardNumber2={setCardNumber2}
              setCardNumber3={setCardNumber3}
              setCardNumber4={setCardNumber4}
              setCardExpiry={setCardExpiry}
              setCardCVC={setCardCVC}
              setCardPassword={setCardPassword}
              handleSearchAddress={handleSearchAddress}
            />
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