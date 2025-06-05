import { Card } from "react-bootstrap";
import { PaymentResponseDto } from "../../../../apis/dto/response/Order";
import { convertOrderStatus } from "../../../../utils/convert";

interface Props {
  orderStatusCode: "OS001" | "OS002" | "OS003" | "OS004" | "OS005" | "OS006" | "OS007";
  payment: PaymentResponseDto | undefined;
}

export default function DeliveryInfoCard(props: Props) {
  const { orderStatusCode, payment } = props;
  return payment ? (
    <Card>
      <Card.Header>
        <h4>{"배송정보"}</h4>
      </Card.Header>
      <Card.Body>
        <p>
          <strong>{"배송상태: "}</strong>
          {orderStatusCode === "OS003" ? "배송준비" : convertOrderStatus(orderStatusCode)}
        </p>
        <p>
          <strong>{"주소: "}</strong>
          {`(${payment.postalCode}) ${payment.defaultAddress} ${payment.detailAddress} ${payment.extraAddress}`}
        </p>
        {orderStatusCode !== "OS003" && (
          <>
            <p>
              <strong>{"송장 번호: "}</strong>
              {payment.invoiceNumber}
            </p>
            <p>
              <strong>{"택배사: "}</strong>
              {payment.courierCompany}
            </p>
            <p>
              <strong>{"배송일: "}</strong>
              {payment.deliveryDate ? new Date(payment.deliveryDate).toLocaleDateString() : null}
            </p>
          </>
        )}
      </Card.Body>
    </Card>
  ) : null;
}
