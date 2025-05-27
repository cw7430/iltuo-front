import { FC, useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";

interface Props {
    type: "cart" | "order";
    totalPrice: number;
}

const TotalPriceCard: FC<Props> = (props) => {
    const { type, totalPrice } = props;

    const [deliveryPrice, setDeliveryPrice] = useState<number>(3000);

    useEffect(() => {
        if (totalPrice >= 50000) {
            setDeliveryPrice(0);
        } else {
            const remaining = 50000 - totalPrice;
            setDeliveryPrice(Math.min(remaining, 3000));
        }
    }, [totalPrice]);

    return (
        <Card>
            <Card.Header>
                <h4>{"주문 요약"}</h4>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col className="text-start">
                        <p>{"총 상품가격: "}</p>
                    </Col>
                    <Col className="text-end">
                        <p>{`${totalPrice.toLocaleString()}원`}</p>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-start">
                        <p>{"배송비: "}</p>
                    </Col>
                    <Col className="text-end">
                        <p>{`${deliveryPrice.toLocaleString()}원`}</p>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col className="text-start">
                        <h5>{"총 주문금액: "}</h5>
                    </Col>
                    <Col className="text-end">
                        <h5>{`${(totalPrice + deliveryPrice).toLocaleString()}원`}</h5>
                    </Col>
                </Row>
            </Card.Body>
            <Card.Footer>
                {(type === "cart" || type === "order") && (
                    <div className="d-grid gap-2">
                        <Button variant="primary" type="button">
                            {"주문하기"}
                        </Button>
                    </div>
                )}
            </Card.Footer>
        </Card>
    );
};

export default TotalPriceCard;
