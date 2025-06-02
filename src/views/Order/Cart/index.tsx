import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Loader } from "../../../components/Gif";
import { CartResponseDto } from "../../../apis/dto/response/Order";
import {
  fetchAddOrders,
  fetchCartList,
  fetchDeleteCart,
  fetchDeleteCartsAll,
} from "../../../apis/server/Order";
import { ApiError } from "../../../apis/server";
import { logoutUser } from "../../../utils/auth";
import { AlertModal, ConfirmModal } from "../../../components/Modals";
import { SelectedItemsCard, TotalPriceCard } from "../../../components/Cards";
import { IdxRequestDto } from "../../../apis/dto/request";
import { AddOrderRequestDto } from "../../../apis/dto/request/Order";
import { DETAIL_PATH, MAIN_PATH } from "../../../constants/url";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cartList, setCartList] = useState<CartResponseDto[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertText, setAlertText] = useState<string>("");
  const [alertAction, setAlertAction] = useState<() => void>(() => {});

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmTitle, setConfirmTitle] = useState<string>("");
  const [confirmText, setConfirmText] = useState<string>("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

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

  const handlePayment = (paymentId: number) => {
    navigate(DETAIL_PATH("payment", paymentId));
  };

  const fetchCartData = useCallback(async () => {
    setIsLoading(true);

    try {
      const cartData = await fetchCartList();
      const sum = cartData.reduce((acc, cart) => acc + cart.price, 0);
      setCartList(cartData);
      setTotalPrice(sum);
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
      setIsLoading(false);
    }
  }, [handleNavigateMainPath]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const handleDeleteCart = async (cartId: number) => {
    const requestBody: IdxRequestDto = {
      idx: cartId,
    };

    try {
      setIsLoading(true);
      const response = await fetchDeleteCart(requestBody);
      if (response) await fetchCartData();
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.code === "UA") {
          showGenericAlertModal("세션만료", "세션이 만료되었습니다. 로그아웃합니다.", () => {
            logoutUser();
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
  };

  const handleOrder = () => {
    if (cartList.length === 0) {
      showGenericAlertModal("경고", "장바구니에 담긴 상품이 없습니다.", () => {});
      return;
    }

    const requestBody: AddOrderRequestDto[] = cartList.map((cart) => ({
      productId: cart.productId,
      quantity: cart.quantity,
      options: cart.options.map((option) => ({
        idx: option.optionDetailId,
      })),
    }));

    showGenericConfirmModal("확인", "장바구니에 담긴 상품을 구매하시겠습니까?", async () => {
      try {
        setIsLoading(true);
        const response = await fetchAddOrders(requestBody);
        if (response) {
          await fetchDeleteCartsAll();
          handlePayment(response.idx);
        }
      } catch (e) {
        if (e instanceof ApiError) {
          if (e.code === "UA") {
            showGenericAlertModal("세션만료", "세션이 만료되었습니다. 로그아웃합니다.", () => {
              logoutUser();
            });
          } else if (e.code === "VF") {
            showGenericAlertModal("경고", "장바구니에 담긴 상품이 없습니다.", () => {});
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
      <Container className="mb-4">
        <Row>
          <Col className="mt-5 text-center">
            <h1 className="mb-4">{"장바구니"}</h1>
          </Col>
        </Row>
        <Row>
          <Col lg={8}>
            <SelectedItemsCard
              type="cart"
              cartItems={cartList}
              handleDeleteCart={handleDeleteCart}
            />
          </Col>
          <Col lg={4}>
            <TotalPriceCard type="cart" totalPrice={totalPrice} handleOrder={handleOrder} />
          </Col>
        </Row>
      </Container>
      {isLoading && <Loader />}
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
    </>
  );
}
