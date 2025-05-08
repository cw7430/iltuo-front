export default interface User {
    userIdx: number;
    userId: string;
    userName: string;
    phoneNumber: string;
    email: string;
    registerDate: string;
    userPermissionsCode: string;
    authMethodCode: string;
    isValid: boolean;
}
