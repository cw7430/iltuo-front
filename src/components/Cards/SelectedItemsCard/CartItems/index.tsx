import { CartResponseDto } from "../../../../apis/dto/response/Order";
import { ListGroup, Row, Col, Button } from "react-bootstrap";
import { API_PATH } from "../../../../constants/url";

interface Props {
  cartItems: CartResponseDto[];
  handleDeleteCart: (cartId: number) => void;
}

export default function CartItems(props: Props) {
  const { cartItems, handleDeleteCart } = props;

  const handleConvertOptionPrice = (price: number): string => {
    if (price < 0) return `${price.toLocaleString()}원`;
    return `+${price.toLocaleString()}원`;
  };

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
                    src={`${API_PATH}/images/product/${cart.productCode}.jpg`}
                    alt="사진"
                  />
                </Col>
                <Col xs={6}>
                  <p>{cart.productName}</p>
                  {cart.options.map((option) => (
                    <p key={option.priorityIndex}>
                      {`${option.optionName}: ${
                        option.optionDetailName
                      } (${handleConvertOptionPrice(option.optionPrice)})`}
                    </p>
                  ))}
                  <p>{`개수: ${cart.quantity}개`}</p>
                  <p>{`가격: ${cart.price.toLocaleString()}원`}</p>
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
}
