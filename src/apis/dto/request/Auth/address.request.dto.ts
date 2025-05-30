export default interface AddressRequestDto {
  postalCode: string;
  defaultAddress: string;
  detailAddress: string | null;
  extraAddress: string | null;
  main: boolean;
}
