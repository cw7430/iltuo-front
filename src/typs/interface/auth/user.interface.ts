export default interface User {
  userIdx: number;
  userId: string;
  registerDate: Date;
  userPermissionsCode: "AR001" | "AR002";
  authMethodCode: "AM001" | "AM002";
  valid: boolean;
}
