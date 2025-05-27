import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Loader } from "../../../components/Gif";
import { CartResponseDto } from "../../../apis/dto/response/Order";
import { fetchCartList, fetchDeleteCart } from "../../../apis/server/Order";
import { ApiError } from "../../../apis/server";
import { logoutUser } from "../../../utils/auth";
import { AlertModal } from "../../../components/Modals";
import { SelectedItemsCard, TotalPriceCard } from "../../../components/Cards";
import { IdxRequestDto } from "../../../apis/dto/request";

export default function Cart() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cartList, setCartList] = useState<CartResponseDto[]>([]);
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
                    showGenericAlertModal(
                        "세션만료",
                        "세션이 만료되었습니다. 로그아웃합니다.",
                        () => {
                            logoutUser();
                        }
                    );
                } else {
                    showGenericAlertModal(
                        "오류",
                        "서버 오류입니다. 나중에 다시 시도하세요.",
                        () => {}
                    );
                }
            } else {
                showGenericAlertModal("오류", "서버 오류입니다. 나중에 다시 시도하세요.", () => {});
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

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
            if (response) fetchCartData();
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
                } else {
                    showGenericAlertModal(
                        "오류",
                        "서버 오류입니다. 나중에 다시 시도하세요.",
                        () => {}
                    );
                }
            } else {
                showGenericAlertModal("오류", "서버 오류입니다. 나중에 다시 시도하세요.", () => {});
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Container className="mb-4">
                <Row>
                    <Col className="mt-5">
                        <h2 className="mb-4">{"장바구니"}</h2>
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
                        <TotalPriceCard type="cart" totalPrice={totalPrice} />
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
