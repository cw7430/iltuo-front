import { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";

type DefaultProps = {
  totalPrice: number;
};

type CartProps = {
  type: "cart";
  handleOrder: () => void;
};

type OrderProps = {
  type: "order";
  orderStatusCode: "OS001" | "OS002" | "OS003" | "OS004" | "OS005" | "OS006" | "OS007";
  handleOrder: () => void;
  handleDeleteOrder: () => void;
};

type PaymentProps = {
  type: "payment";
  handleValidate: () => void;
  handleDeleteOrder: () => void;
};

type Props = DefaultProps & (CartProps | OrderProps | PaymentProps);

export default function TotalPriceCard(props: Props) {
  const [deliveryPrice, setDeliveryPrice] = useState<number>(3000);

  useEffect(() => {
    if (props.totalPrice >= 50000) {
      setDeliveryPrice(0);
    } else {
      const remaining = 50000 - props.totalPrice;
      setDeliveryPrice(Math.min(remaining, 3000));
    }
  }, [props.totalPrice]);

  const renderButtons = () => {
    if (props.type === "cart") {
      return (
        <Card.Footer>
          <div className="d-grid gap-2">
            <Button variant="primary" type="button" onClick={props.handleOrder}>
              {"주문하기"}
            </Button>
          </div>
        </Card.Footer>
      );
    }

    if (props.type === "order" && props.orderStatusCode === "OS001") {
      return (
        <Card.Footer>
          <div className="d-flex gap-2">
            <Button variant="primary" className="flex-grow-1" onClick={props.handleOrder}>
              {"주문하기"}
            </Button>
            <Button variant="danger" className="flex-grow-1" onClick={props.handleDeleteOrder}>
              {"취소하기"}
            </Button>
          </div>
        </Card.Footer>
      );
    }

    if (props.type === "payment") {
      return (
        <Card.Footer>
          <div className="d-flex gap-2">
            <Button variant="primary" className="flex-grow-1" onClick={props.handleValidate}>
              {"주문하기"}
            </Button>
            <Button variant="danger" className="flex-grow-1" onClick={props.handleDeleteOrder}>
              {"취소하기"}
            </Button>
          </div>
        </Card.Footer>
      );
    }

    return null;
  };

  return (
    <Card>
      <Card.Header>
        <h4>금액</h4>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col className="text-start">
            <p>총 상품가격: </p>
          </Col>
          <Col className="text-end">
            <p>{`${props.totalPrice.toLocaleString()}원`}</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-start">
            <p>배송비: </p>
          </Col>
          <Col className="text-end">
            <p>{`${deliveryPrice.toLocaleString()}원`}</p>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="text-start">
            <h5>총 주문금액: </h5>
          </Col>
          <Col className="text-end">
            <h5>{`${(props.totalPrice + deliveryPrice).toLocaleString()}원`}</h5>
          </Col>
        </Row>
      </Card.Body>
      <>{renderButtons()}</>
    </Card>
  );
}
