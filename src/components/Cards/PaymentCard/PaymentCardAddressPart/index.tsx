import { Dispatch, SetStateAction } from "react";
import { AddressResponseDto } from "../../../../apis/dto/response/Auth";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";

interface Props {
  addressList: AddressResponseDto[];
  addressMethod: "A" | "B" | "C";
  postalCode: string;
  defaultAddress: string;
  detailAddress: string;
  extraAddress: string;
  isAddressError: boolean;
  detailAddressRef: React.RefObject<HTMLInputElement | null>;
  setAddressMethod: Dispatch<SetStateAction<"A" | "B" | "C">>;
  setPostalCode: Dispatch<SetStateAction<string>>;
  setDefaultAddress: Dispatch<SetStateAction<string>>;
  setDetailAddress: Dispatch<SetStateAction<string>>;
  setExtraAddress: Dispatch<SetStateAction<string>>;
  handleSearchAddress: () => void;
}

export default function PaymentCardAddressPart(props: Props) {
  const {
    addressList,
    addressMethod,
    postalCode,
    defaultAddress,
    detailAddress,
    extraAddress,
    isAddressError,
    detailAddressRef,
    setAddressMethod,
    setPostalCode,
    setDefaultAddress,
    setDetailAddress,
    setExtraAddress,
    handleSearchAddress,
  } = props;

  return (
    <>
      <Form.Group className="mb-3" controlId="payment-address-method">
        <Form.Label>{"주소"}</Form.Label>
        <InputGroup>
          {addressList.length > 0 && (
            <Form.Check
              type="radio"
              label="등록된 주소"
              value="A"
              checked={addressMethod === "A"}
              onChange={() => setAddressMethod("A")}
              isInvalid={isAddressError}
            />
          )}
          <Form.Check
            type="radio"
            className="ms-4"
            label="등록 되지 않은 주소"
            value="B"
            checked={addressMethod === "B" || addressList.length < 1}
            onChange={() => setAddressMethod("B")}
            isInvalid={isAddressError}
          />
        </InputGroup>
      </Form.Group>
      <Row className="mb-2">
        <Col style={{ maxWidth: "200px" }}>
          <InputGroup>
            <Form.Control
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="우편번호"
              isInvalid={isAddressError}
              readOnly={true}
              disabled={addressMethod === "C"}
            />
          </InputGroup>
        </Col>
        <Col xs="auto">
          <Button
            variant="secondary"
            type="button"
            onClick={handleSearchAddress}
            disabled={addressMethod === "C"}
          >
            {"주소 검색"}
          </Button>
        </Col>
      </Row>
      <Form.Group className="mb-2">
        <InputGroup>
          <Form.Control
            type="text"
            value={defaultAddress}
            onChange={(e) => setDefaultAddress(e.target.value)}
            placeholder="주소"
            isInvalid={isAddressError}
            readOnly={true}
            disabled={addressMethod === "C"}
          />
          <Form.Control.Feedback type="invalid">{"주소를 입력하여주세요."}</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Row className="mb-2">
        <Form.Group as={Col}>
          <InputGroup>
            <Form.Control
              type="text"
              ref={detailAddressRef}
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              placeholder="상세 주소"
              readOnly={addressMethod === "A"}
              disabled={addressMethod === "C"}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} className="mb-2">
          <InputGroup>
            <Form.Control
              type="text"
              value={extraAddress}
              onChange={(e) => setExtraAddress(e.target.value)}
              placeholder="참고 항목"
              readOnly={true}
              disabled={addressMethod === "C"}
            />
          </InputGroup>
        </Form.Group>
      </Row>
    </>
  );
}
