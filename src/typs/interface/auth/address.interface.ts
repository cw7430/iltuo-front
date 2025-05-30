export default interface Address {
  addressId: number;
  userIdx: number;
  postalCode: string;
  defaultAddress: string;
  detailAddress: string | null;
  extraAddress: string | null;
  main: boolean;
  valid: boolean;
}
