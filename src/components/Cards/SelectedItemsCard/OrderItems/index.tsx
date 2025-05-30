import { FC } from "react";
import { OrderGroupResponseDto } from "../../../../apis/dto/response/Order";
import { Col, ListGroup } from "react-bootstrap";

interface Props {
  orderItems: OrderGroupResponseDto | undefined;
}

const OrderItems: FC<Props> = (props) => {
  const { orderItems } = props;

  const handleConvertOptionPrice = (price: number): string => {
    if (price < 0) return `${price.toLocaleString()}원`;
    return `+${price.toLocaleString()}원`;
  };

  return (
    <>
      {!orderItems ? (
        <p className="text-muted">{"데이터를 불러오지 못하였습니다."}</p>
      ) : (
        <ListGroup variant="flush">
          {orderItems.orders.map((order, idx) => (
            <ListGroup.Item key={idx} className="py-2">
              <Col xs={4}>
                <img
                  src={`http://localhost:3000/mock/images/product/${order.productCode}.jpg`}
                  alt="사진"
                />
              </Col>
              <Col xs={8}>
                <p>{order.productName}</p>
                {order.orderOptions.map((option) => (
                  <p key={option.priorityIndex}>
                    {`${option.optionName}: ${option.optionDetailName} (${handleConvertOptionPrice(
                      option.optionFluctuatingPrice
                    )})`}
                  </p>
                ))}
                <p>{`개수: ${order.quantity}개`}</p>
                <p>{`가격: ${order.price.toLocaleString()}원`}</p>
              </Col>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default OrderItems;
