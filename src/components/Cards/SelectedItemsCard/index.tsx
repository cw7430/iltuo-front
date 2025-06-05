import { Card } from "react-bootstrap";
import { CartResponseDto, OrderGroupResponseDto } from "../../../apis/dto/response/Order";
import CartItems from "./CartItems";
import OrderItems from "./OrderItems";

type CartProps = {
  type: "cart";
  cartItems: CartResponseDto[];
  handleDeleteCart: (cartId: number) => void;
};

type OrderProps = {
  type: "order";
  orderItems: OrderGroupResponseDto | undefined;
};

type Props = CartProps | OrderProps;

export default function SelectedItemsCard(props: Props) {
  return (
    <Card>
      <Card.Header>
        <h4>
          {props.type === "cart" && "내 장바구니"}
          {props.type === "order" && "주문 내역"}
        </h4>
      </Card.Header>
      <Card.Body>
        {props.type === "cart" && (
          <CartItems cartItems={props.cartItems} handleDeleteCart={props.handleDeleteCart} />
        )}
        {props.type === "order" && <OrderItems orderItems={props.orderItems} />}
      </Card.Body>
    </Card>
  );
}
