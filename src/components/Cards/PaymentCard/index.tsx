import { Dispatch, SetStateAction } from "react";
import { Card } from "react-bootstrap";
import { AddressResponseDto } from "../../../apis/dto/response/Auth";
import PaymentCardAddressPart from "./PaymentCardAddressPart";
import PaymentCardPayPart from "./PaymentCardPayPart";

interface Props {
  addressList: AddressResponseDto[];
  addressMethod: "A" | "B" | "C";
  postalCode: string;
  defaultAddress: string;
  detailAddress: string;
  extraAddress: string;
  paymentMethod: "PM001" | "PM002" | "PM000";
  cardNumber1: string;
  cardNumber2: string;
  cardNumber3: string;
  cardNumber4: string;
  cardExpiry: string;
  cardCVC: string;
  cardPassword: string;
  isAddressError: boolean;
  isPaymentError: boolean;
  isCardNumberError: boolean;
  isCardExpiryError: boolean;
  isCardCVCError: boolean;
  isCardPasswordError: boolean;
  cardNumberErrorMessage: string;
  cardExpirErrorMessage: string;
  cardCVCErrorMessage: string;
  cardPasswordErrorMessage: string;
  detailAddressRef: React.RefObject<HTMLInputElement | null>;
  setAddressMethod: Dispatch<SetStateAction<"A" | "B" | "C">>;
  setPostalCode: Dispatch<SetStateAction<string>>;
  setDefaultAddress: Dispatch<SetStateAction<string>>;
  setDetailAddress: Dispatch<SetStateAction<string>>;
  setExtraAddress: Dispatch<SetStateAction<string>>;
  setPaymentMethod: Dispatch<SetStateAction<"PM001" | "PM002" | "PM000">>;
  setCardNumber1: Dispatch<SetStateAction<string>>;
  setCardNumber2: Dispatch<SetStateAction<string>>;
  setCardNumber3: Dispatch<SetStateAction<string>>;
  setCardNumber4: Dispatch<SetStateAction<string>>;
  setCardExpiry: Dispatch<SetStateAction<string>>;
  setCardCVC: Dispatch<SetStateAction<string>>;
  setCardPassword: Dispatch<SetStateAction<string>>;
  handleSearchAddress: () => void;
}

export default function PaymentCard(props: Props) {
  const {
    addressList,
    addressMethod,
    postalCode,
    defaultAddress,
    detailAddress,
    extraAddress,
    paymentMethod,
    cardNumber1,
    cardNumber2,
    cardNumber3,
    cardNumber4,
    cardExpiry,
    cardCVC,
    cardPassword,
    isAddressError,
    isPaymentError,
    isCardNumberError,
    isCardExpiryError,
    isCardCVCError,
    isCardPasswordError,
    cardNumberErrorMessage,
    cardExpirErrorMessage,
    cardCVCErrorMessage,
    cardPasswordErrorMessage,
    detailAddressRef,
    setAddressMethod,
    setPostalCode,
    setDefaultAddress,
    setDetailAddress,
    setExtraAddress,
    setPaymentMethod,
    setCardNumber1,
    setCardNumber2,
    setCardNumber3,
    setCardNumber4,
    setCardExpiry,
    setCardCVC,
    setCardPassword,
    handleSearchAddress,
  } = props;

  return (
    <Card>
      <Card.Header>
        <h4>{"결제"}</h4>
      </Card.Header>
      <Card.Body>
        <PaymentCardAddressPart
          addressList={addressList}
          addressMethod={addressMethod}
          postalCode={postalCode}
          defaultAddress={defaultAddress}
          detailAddress={detailAddress}
          extraAddress={extraAddress}
          isAddressError={isAddressError}
          detailAddressRef={detailAddressRef}
          setAddressMethod={setAddressMethod}
          setPostalCode={setPostalCode}
          setDefaultAddress={setDefaultAddress}
          setDetailAddress={setDetailAddress}
          setExtraAddress={setExtraAddress}
          handleSearchAddress={handleSearchAddress}
        />
        <PaymentCardPayPart
          paymentMethod={paymentMethod}
          cardNumber1={cardNumber1}
          cardNumber2={cardNumber2}
          cardNumber3={cardNumber3}
          cardNumber4={cardNumber4}
          cardExpiry={cardExpiry}
          cardCVC={cardCVC}
          cardPassword={cardPassword}
          isPaymentError={isPaymentError}
          isCardNumberError={isCardNumberError}
          isCardExpiryError={isCardExpiryError}
          isCardCVCError={isCardCVCError}
          isCardPasswordError={isCardPasswordError}
          cardNumberErrorMessage={cardNumberErrorMessage}
          cardExpirErrorMessage={cardExpirErrorMessage}
          cardCVCErrorMessage={cardCVCErrorMessage}
          cardPasswordErrorMessage={cardPasswordErrorMessage}
          setPaymentMethod={setPaymentMethod}
          setCardNumber1={setCardNumber1}
          setCardNumber2={setCardNumber2}
          setCardNumber3={setCardNumber3}
          setCardNumber4={setCardNumber4}
          setCardExpiry={setCardExpiry}
          setCardCVC={setCardCVC}
          setCardPassword={setCardPassword}
        />
      </Card.Body>
    </Card>
  );
}
