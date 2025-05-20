export default interface User {
    userIdx: number;
    userId: string;
    registerDate: Date;
    userPermissionsCode: string;
    authMethodCode: string;
    valid: boolean;
}
