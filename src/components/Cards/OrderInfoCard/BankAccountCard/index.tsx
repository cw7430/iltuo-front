import { Card } from "react-bootstrap";

export default function BankAccountCard() {
  return (
    <Card>
      <Card.Header>
        <h4>{"입금정보"}</h4>
      </Card.Header>
      <Card.Body>
        <p>
          <strong>{"은행명: "}</strong>
          {"신한은행"}
        </p>
        <p>
          <strong>{"계좌번호: "}</strong>
          {"110-456-789123"}
        </p>
        <p>
          <strong>{"입금자명: "}</strong>
          {"최사장"}
        </p>
      </Card.Body>
    </Card>
  );
}
