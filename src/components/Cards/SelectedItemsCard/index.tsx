import { FC } from "react";
import { Card } from "react-bootstrap";
import { CartResponseDto } from "../../../apis/dto/response/Order";
import CartItems from "./CartItems";

type CartProps = {
    type: "cart";
    cartItems: CartResponseDto[];
    handleDeleteCart: (cartId: number) => void;
};

type Props = CartProps;

const SelectedItemsCard: FC<Props> = (props: Props) => {
    return (
        <Card>
            <Card.Header>
                <h4>{props.type === "cart" && "내 장바구니"}</h4>
            </Card.Header>
            <Card.Body>
                {props.type === "cart" && (
                    <CartItems
                        cartItems={props.cartItems}
                        handleDeleteCart={props.handleDeleteCart}
                    />
                )}
            </Card.Body>
        </Card>
    );
};

export default SelectedItemsCard;
