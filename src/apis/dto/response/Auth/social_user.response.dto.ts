import { SocialAuth, User } from "../../../../typs/interface/auth";

type SocialUserResponseDto = Omit<User & SocialAuth, "isValid">;

export default SocialUserResponseDto;