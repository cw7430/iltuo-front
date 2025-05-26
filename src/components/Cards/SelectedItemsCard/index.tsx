import { Dispatch, FC, SetStateAction } from "react";
import { Card } from "react-bootstrap";
import { CartResponseDto, CartOptionResponseDto } from "../../../apis/dto/response/Order";
import CartItems from "./CartItems";

type CartProps = {
    type: "cart";
    cartItems: CartResponseDto[];
    cartOptions: CartOptionResponseDto[];
    handleDeleteCart: (cartId: number) => void;
    setTotalItemsPrice: Dispatch<SetStateAction<number>>;
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
                        cartOptions={props.cartOptions}
                        handleDeleteCart={props.handleDeleteCart}
                        setTotalItemsPrice={props.setTotalItemsPrice}
                    />
                )}
            </Card.Body>
        </Card>
    );
};

export default SelectedItemsCard;
