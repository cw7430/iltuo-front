import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Loader } from "../../../components/Gif";
import { OrderGroupResponseDto } from "../../../apis/dto/response/Order";
import { fetchOrderList } from "../../../apis/server/Order";
import { ApiError } from "../../../apis/server";
import { logoutUser } from "../../../utils/auth";
import { AlertModal } from "../../../components/Modals";

function OrderGroup() {
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

  return (
    <>
      <Container className="mb-4">
        <Row>
          <Col className="mt-5 text-center">
            <h1 className="mb-4">{"주문내역"}</h1>
          </Col>
        </Row>
        <Row></Row>
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

export default OrderGroup;
