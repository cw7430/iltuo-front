import { Dispatch, SetStateAction, useRef } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";

interface Props {
  paymentMethod: "PM001" | "PM002" | "PM000";
  cardNumber1: string;
  cardNumber2: string;
  cardNumber3: string;
  cardNumber4: string;
  cardExpiry: string;
  cardCVC: string;
  cardPassword: string;
  isPaymentError: boolean;
  isCardNumberError: boolean;
  isCardExpiryError: boolean;
  isCardCVCError: boolean;
  isCardPasswordError: boolean;
  cardNumberErrorMessage: string;
  cardExpirErrorMessage: string;
  cardCVCErrorMessage: string;
  cardPasswordErrorMessage: string;
  setPaymentMethod: Dispatch<SetStateAction<"PM001" | "PM002" | "PM000">>;
  setCardNumber1: Dispatch<SetStateAction<string>>;
  setCardNumber2: Dispatch<SetStateAction<string>>;
  setCardNumber3: Dispatch<SetStateAction<string>>;
  setCardNumber4: Dispatch<SetStateAction<string>>;
  setCardExpiry: Dispatch<SetStateAction<string>>;
  setCardCVC: Dispatch<SetStateAction<string>>;
  setCardPassword: Dispatch<SetStateAction<string>>;
}

export default function PaymentCardPayPart(props: Props) {
  const {
    paymentMethod,
    cardNumber1,
    cardNumber2,
    cardNumber3,
    cardNumber4,
    cardExpiry,
    cardCVC,
    cardPassword,
    isPaymentError,
    isCardNumberError,
    isCardExpiryError,
    isCardCVCError,
    isCardPasswordError,
    cardNumberErrorMessage,
    cardExpirErrorMessage,
    cardCVCErrorMessage,
    cardPasswordErrorMessage,
    setPaymentMethod,
    setCardNumber1,
    setCardNumber2,
    setCardNumber3,
    setCardNumber4,
    setCardExpiry,
    setCardCVC,
    setCardPassword,
  } = props;

  const cardNumber1Ref = useRef<HTMLInputElement>(null);
  const cardNumber2Ref = useRef<HTMLInputElement>(null);
  const cardNumber3Ref = useRef<HTMLInputElement>(null);
  const cardNumber4Ref = useRef<HTMLInputElement>(null);
  const cardExpiryRef = useRef<HTMLInputElement>(null);
  const cardCVCRef = useRef<HTMLInputElement>(null);
  const cardPasswordRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Form.Group className="mb-2" controlId="payment-method">
        <Form.Label>{"결제방식"}</Form.Label>
        <InputGroup>
          <Form.Check
            type="radio"
            label="신용카드"
            value="PM001"
            checked={paymentMethod === "PM001"}
            onChange={() => setPaymentMethod("PM001")}
            isInvalid={isPaymentError}
          />
          <Form.Check
            type="radio"
            className="ms-4"
            label="무통장 입금"
            value="PM002"
            checked={paymentMethod === "PM002"}
            onChange={() => setPaymentMethod("PM002")}
            isInvalid={isPaymentError}
          />
        </InputGroup>
        {isPaymentError && (
          <div className="invalid-feedback" style={{ display: "block" }}>
            {"결제 방식을 선택하여주세요."}
          </div>
        )}
      </Form.Group>
      {paymentMethod === "PM001" && (
        <>
          <Form.Group className="mb-2" controlId="card-number">
            <Form.Label>{"카드번호"}</Form.Label>
            <InputGroup as={Row}>
              <Col>
                <Form.Control
                  type="text"
                  ref={cardNumber1Ref}
                  maxLength={4}
                  value={cardNumber1}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setCardNumber1(value);
                    if (!cardNumber2Ref.current) return;
                    if (value.length === 4) cardNumber2Ref.current.focus();
                  }}
                  isInvalid={isCardNumberError}
                />
              </Col>
              <Col>
                <Form.Control
                  type="password"
                  ref={cardNumber2Ref}
                  maxLength={4}
                  value={cardNumber2}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setCardNumber2(value);
                    if (!cardNumber3Ref.current) return;
                    if (value.length === 4) cardNumber3Ref.current.focus();
                  }}
                  onKeyDown={(e) => {
                    if (!cardNumber1Ref.current) return;
                    if (e.key === "Backspace" && cardNumber2.length === 0) {
                      cardNumber1Ref.current.focus();
                    }
                  }}
                  isInvalid={isCardNumberError}
                />
              </Col>
              <Col>
                <Form.Control
                  type="password"
                  ref={cardNumber3Ref}
                  maxLength={4}
                  value={cardNumber3}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setCardNumber3(value);
                    if (!cardNumber4Ref.current) return;
                    if (value.length === 4) cardNumber4Ref.current.focus();
                  }}
                  onKeyDown={(e) => {
                    if (!cardNumber2Ref.current) return;
                    if (e.key === "Backspace" && cardNumber3.length === 0) {
                      cardNumber2Ref.current.focus();
                    }
                  }}
                  isInvalid={isCardNumberError}
                />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  ref={cardNumber4Ref}
                  maxLength={4}
                  value={cardNumber4}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setCardNumber4(value);
                    if (!cardExpiryRef.current) return;
                    if (value.length === 4) cardExpiryRef.current.focus();
                  }}
                  onKeyDown={(e) => {
                    if (!cardNumber3Ref.current) return;
                    if (e.key === "Backspace" && cardNumber4.length === 0) {
                      cardNumber3Ref.current.focus();
                    }
                  }}
                  isInvalid={isCardNumberError}
                />
              </Col>
            </InputGroup>
            <Row>
              <Col>
                {isCardNumberError && (
                  <div className="invalid-feedback" style={{ display: "block" }}>
                    {cardNumberErrorMessage}
                  </div>
                )}
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-2" controlId="card-expiry">
            <Form.Label>{"유효기간"}</Form.Label>
            <InputGroup as={Row} style={{ width: "150px" }}>
              <Col>
                <Form.Control
                  type="text"
                  ref={cardExpiryRef}
                  maxLength={5}
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => {
                    let input = e.target.value.replace(/\D/g, "");

                    if (input.length >= 2) {
                      let month = parseInt(input.substring(0, 2), 10);
                      if (month > 12) month = 12;
                      const monthStr = month.toString().padStart(2, "0");

                      if (input.length > 2) {
                        const year = input.substring(2, 4);
                        setCardExpiry(`${monthStr}/${year}`);
                      } else {
                        setCardExpiry(`${monthStr}`);
                      }
                    } else {
                      setCardExpiry(input);
                    }
                    if (!cardCVCRef.current) return;
                    if (!cardExpiryRef.current) return;
                    if (cardExpiryRef.current.value.length === 5) {
                      cardCVCRef.current.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (!cardNumber4Ref.current) return;
                    if (e.key === "Backspace" && cardExpiry.length === 0) {
                      cardNumber4Ref.current.focus();
                    }
                  }}
                  isInvalid={isCardExpiryError}
                />
              </Col>
            </InputGroup>
            <Row>
              <Col>
                {isCardExpiryError && (
                  <div className="invalid-feedback" style={{ display: "block" }}>
                    {cardExpirErrorMessage}
                  </div>
                )}
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-2" controlId="card-CVC">
            <Form.Label>{"CVC"}</Form.Label>
            <InputGroup as={Row} style={{ width: "150px" }}>
              <Col>
                <Form.Control
                  type="password"
                  ref={cardCVCRef}
                  value={cardCVC}
                  maxLength={3}
                  placeholder="CVC"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setCardCVC(value);
                    if (!cardPasswordRef.current) return;
                    if (value.length === 3) cardPasswordRef.current.focus();
                  }}
                  onKeyDown={(e) => {
                    if (!cardExpiryRef.current) return;
                    if (e.key === "Backspace" && cardCVC.length === 0) {
                      cardExpiryRef.current.focus();
                    }
                  }}
                  isInvalid={isCardCVCError}
                />
              </Col>
            </InputGroup>
            <Row>
              <Col>
                {isCardCVCError && (
                  <div className="invalid-feedback" style={{ display: "block" }}>
                    {cardCVCErrorMessage}
                  </div>
                )}
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-4" controlId="card-password">
            <Form.Label>{"비밀번호"}</Form.Label>
            <InputGroup as={Row} style={{ width: "150px" }}>
              <Col>
                <Form.Control
                  type="password"
                  ref={cardPasswordRef}
                  value={cardPassword}
                  maxLength={4}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setCardPassword(value);
                  }}
                  onKeyDown={(e) => {
                    if (!cardCVCRef.current) return;
                    if (e.key === "Backspace" && cardPassword.length === 0) {
                      cardCVCRef.current.focus();
                    }
                  }}
                  isInvalid={isCardPasswordError}
                />
              </Col>
            </InputGroup>
            <Row>
              <Col>
                {isCardPasswordError && (
                  <div className="invalid-feedback" style={{ display: "block" }}>
                    {cardPasswordErrorMessage}
                  </div>
                )}
              </Col>
            </Row>
          </Form.Group>
        </>
      )}
      {paymentMethod === "PM002" && (
        <>
          <h5>
            <strong>{"무통장입금 안내"}</strong>
          </h5>
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
          <p>{"입금하실 계좌번호는 주문 내역에서 다시 확인하실 수 있습니다."}</p>
        </>
      )}
    </>
  );
}
