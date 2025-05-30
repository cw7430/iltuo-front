import { NativeAuth, User } from "../../../../typs/interface/auth";

type NativeUserResponseDto = Omit<User & NativeAuth, "valid" | "password">;

export default NativeUserResponseDto;
