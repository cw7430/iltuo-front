import { NativeAuth, User } from "../../../../typs/interface/auth";

type NativeUserResponseDto = Omit<User & NativeAuth, "isValid"|"password">;

export default NativeUserResponseDto;