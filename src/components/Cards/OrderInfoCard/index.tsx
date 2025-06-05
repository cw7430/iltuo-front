import BankAccountCard from "./BankAccountCard";
import { PaymentResponseDto } from "../../../apis/dto/response/Order";
import DeliveryInfoCard from "./DeliveryInfoCard";

interface Props {
  orderStatusCode: "OS001" | "OS002" | "OS003" | "OS004" | "OS005" | "OS006" | "OS007";
  payment: PaymentResponseDto | undefined;
}

export default function OrderInfoCard(props: Props) {
  const { orderStatusCode, payment } = props;

  if (orderStatusCode === "OS002") return <BankAccountCard />;

  return <DeliveryInfoCard orderStatusCode={orderStatusCode} payment={payment} />;
}
