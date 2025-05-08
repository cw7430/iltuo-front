export default interface Address {
    addressId: number;
    userIdx: number;
    postalCode: string;
    defaultAddress: string;
    detailAddress: string | null;
    extraAddress: string | null;
    isMain: boolean;
    isValid: boolean;
}
