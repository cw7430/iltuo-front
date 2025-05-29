import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Loader } from "../../../components/Gif";
import { AlertModal } from "../../../components/Modals";
import { OrderGroupResponseDto } from "../../../apis/dto/response/Order";
import { fetchOrderData } from "../../../apis/server/Order";
import { IdxRequestDto } from "../../../apis/dto/request";
import { ApiError } from "../../../apis/server";
import { logoutUser } from "../../../utils/auth";
import { MAIN_PATH } from "../../../constants/url";
import { SelectedItemsCard } from "../../../components/Cards";

export default function Order() {
    const navigate = useNavigate();

    const { orderId } = useParams<{ orderId: string }>();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [orderGroup, setOrderGroup] = useState<OrderGroupResponseDto | undefined>(undefined);
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

    const fetchData = useCallback(async () => {
        if (orderId) {
            setIsLoading(true);
            const requestBody: IdxRequestDto = {
                idx: Number(orderId),
            };
            try {
                const orderData = await fetchOrderData(requestBody);
                const sum = orderData.orders.reduce((sum, order) => sum + order.price, 0);
                setOrderGroup(orderData);
                setTotalPrice(sum);
            } catch (e) {
                if (e instanceof ApiError) {
                    if (e.code === "UA") {
                        showGenericAlertModal(
                            "세션만료",
                            "세션이 만료되었습니다. 로그아웃합니다.",
                            () => {
                                logoutUser();
                            }
                        );
                    } else if (e.code === "FB") {
                        showGenericAlertModal("경고", "접근하실 수 없는 페이지입니다.", () => {
                            handleNavigateMainPath();
                        });
                    } else {
                        showGenericAlertModal(
                            "오류",
                            "서버 오류입니다. 나중에 다시 시도하세요.",
                            () => {}
                        );
                    }
                } else {
                    showGenericAlertModal(
                        "오류",
                        "서버 오류입니다. 나중에 다시 시도하세요.",
                        () => {}
                    );
                }
            } finally {
                setIsLoading(false);
            }
        }
    }, [orderId, handleNavigateMainPath]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <Container className="mb-4">
                <Row>
                    <Col className="mt-5">
                        <h2 className="mb-4">{"주문"}</h2>
                    </Col>
                </Row>
                <Row>
                    <Col lg={8}>
                        <SelectedItemsCard type="order" orderItems={orderGroup} />
                    </Col>
                    <Col lg={4}></Col>
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
