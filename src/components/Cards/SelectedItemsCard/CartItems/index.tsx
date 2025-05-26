import { Dispatch, FC, SetStateAction } from "react";
import { CartOptionResponseDto, CartResponseDto } from "../../../../apis/dto/response/Order";
import { ListGroup, Row, Col, Button } from "react-bootstrap";

interface Props {
    cartItems: CartResponseDto[];
    cartOptions: CartOptionResponseDto[];
    handleDeleteCart: (cartId: number) => void;
    setTotalItemsPrice: Dispatch<SetStateAction<number>>;
}

const CartItems: FC<Props> = (props) => {
    const { cartItems, cartOptions, handleDeleteCart, setTotalItemsPrice } = props;

    return (
        <>
            {cartItems.length === 0 ? (
                <p className="text-muted">{"장바구니에 담긴 상품이 없습니다."}</p>
            ) : (
                <ListGroup variant="flush">
                    {cartItems.map((cart, idx) => (
                        <ListGroup.Item key={idx} className="py-2">
                            <Row className="align-items-center">
                                <Col xs={3}>
                                    <img
                                        src={`http://localhost:3000/mock/images/product/${cart.productCode}.jpg`}
                                        alt="사진"
                                    />
                                </Col>
                                <Col xs={6}>
                                    <p>{cart.productName}</p>
                                    {cartOptions
                                        .filter((option) => cart.cartId === option.cartId)
                                        .map((option) => (
                                            <p key={option.priorityIndex}>
                                                {`${option.optionName}: ${option.optionDetailName}`}
                                            </p>
                                        ))}
                                    <p>{`개수: ${cart.quantity}개`}</p>
                                </Col>
                                <Col xs={3}>
                                    <Button
                                        variant="danger"
                                        type="button"
                                        onClick={() => handleDeleteCart(cart.cartId)}
                                    >
                                        {"삭제"}
                                    </Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </>
    );
};

export default CartItems;
