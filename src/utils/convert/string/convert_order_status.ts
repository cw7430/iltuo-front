const statusMap: Record<string, string> = {
  OS001: "미주문",
  OS002: "입금대기",
  OS003: "결제완료",
  OS004: "배송중",
  OS005: "배송완료",
  OS006: "취소",
  OS007: "환불",
};

const convertOrderStatus = (code: string): string => {
  return statusMap[code] || "미주문";
};

export default convertOrderStatus;
