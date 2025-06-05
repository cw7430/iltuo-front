import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Loader } from "../../../components/Gif";
import { OrderGroupResponseDto } from "../../../apis/dto/response/Order";
import { fetchOrderList } from "../../../apis/server/Order";
import { ApiError } from "../../../apis/server";
import { logoutUser } from "../../../utils/auth";
import { AlertModal } from "../../../components/Modals";
import { useNavigate } from "react-router-dom";
import { DETAIL_PATH } from "../../../constants/url";
import { convertOrderStatus } from "../../../utils/convert";

export default function OrderGroup() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderGroupList, setOrderGroupList] = useState<OrderGroupResponseDto[]>([]);

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const orderList = await fetchOrderList();
        setOrderGroupList(orderList);
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

    fetchData();
  }, []);

  const FREE_DELIVERY_THRESHOLD = 50000;
  const DELIVERY_FEE = 3000;

  const calculateTotalPrice = (group: OrderGroupResponseDto): string => {
    const itemTotal = group.orders.reduce((sum, order) => sum + order.price, 0);
    if (itemTotal >= FREE_DELIVERY_THRESHOLD) return `${itemTotal.toLocaleString()}원`;
    const withDelivery = itemTotal + DELIVERY_FEE;
    return withDelivery >= FREE_DELIVERY_THRESHOLD
      ? `${FREE_DELIVERY_THRESHOLD.toLocaleString()}원`
      : `${withDelivery.toLocaleString()}원`;
  };

  return (
    <>
      <Container className="mb-4">
        <Row>
          <Col className="mt-5 text-center">
            <h1 className="mb-4">{"주문내역"}</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table responsive hover>
              <thead className="table-dark">
                <tr>
                  <th className="text-start">{"주문일자"}</th>
                  <th className="text-start">{"상품명"}</th>
                  <th className="text-end">{"총액"}</th>
                  <th className="text-center">{"상태"}</th>
                </tr>
              </thead>
              <tbody>
                {orderGroupList.map((group, groupIdx) => (
                  <tr
                    key={groupIdx}
                    onClick={() => navigate(DETAIL_PATH("order", group.paymentId))}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="text-start">{new Date(group.orderDate).toLocaleDateString()}</td>
                    <td className="text-start">
                      {group.orders.map((order, orderIdx) => (
                        <span key={orderIdx}>
                          {`${order.productName} (${order.quantity}개)`}
                          <br />
                        </span>
                      ))}
                    </td>
                    <td className="text-end">{calculateTotalPrice(group)}</td>
                    <td className="text-center">{convertOrderStatus(group.orderStatusCode)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
