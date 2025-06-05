import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Loader } from "../../../components/Gif";
import { AlertModal } from "../../../components/Modals";
import { OrderGroupResponseDto, PaymentResponseDto } from "../../../apis/dto/response/Order";
import { fetchDeleteOrder, fetchOrderData, fetchPayment } from "../../../apis/server/Order";
import { IdxRequestDto } from "../../../apis/dto/request";
import { ApiError } from "../../../apis/server";
import { logoutUser } from "../../../utils/auth";
import { DETAIL_PATH, MAIN_PATH } from "../../../constants/url";
import { OrderInfoCard, SelectedItemsCard, TotalPriceCard } from "../../../components/Cards";

export default function Order() {
  const navigate = useNavigate();

  const { paymentId } = useParams<{ paymentId: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderGroup, setOrderGroup] = useState<OrderGroupResponseDto | undefined>(undefined);
  const [payment, setPayment] = useState<PaymentResponseDto | undefined>(undefined);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertText, setAlertText] = useState<string>("");
  const [alertAction, setAlertAction] = useState<() => void>(() => {});

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

  const handleNavigateMainPath = useCallback(() => {
    navigate(MAIN_PATH());
  }, [navigate]);

  const handleOrder = () => {
    navigate(DETAIL_PATH("payment", Number(paymentId)));
  };

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
        const sum = orderData.orders.reduce((sum, order) => sum + order.price, 0);
        setOrderGroup(orderData);
        setTotalPrice(sum);
        if (orderData.orderStatusCode !== "OS001" && orderData.orderStatusCode !== "OS006") {
          const paymentData = await fetchPayment(requestBody);
          setPayment(paymentData);
        }
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

  return (
    <>
      <Container className="mb-4">
        <Row>
          <Col className="mt-5 text-center">
            <h1 className="mb-4">{"주문"}</h1>
          </Col>
        </Row>
        <Row>
          <Col lg={8}>
            <SelectedItemsCard type="order" orderItems={orderGroup} />
          </Col>
          <Col lg={4}>
            <Row>
              <Col>
                <TotalPriceCard
                  type="order"
                  totalPrice={totalPrice}
                  orderStatusCode={orderGroup ? orderGroup.orderStatusCode : "OS001"}
                  handleOrder={handleOrder}
                  handleDeleteOrder={handleDeleteOrder}
                />
              </Col>
            </Row>
            <br />
            {orderGroup
              ? orderGroup.orderStatusCode !== "OS001" &&
                orderGroup.orderStatusCode !== "OS006" && (
                  <Row>
                    <Col>
                      <OrderInfoCard
                        orderStatusCode={orderGroup.orderStatusCode}
                        payment={payment}
                      />
                    </Col>
                  </Row>
                )
              : null}
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
    </>
  );
}
