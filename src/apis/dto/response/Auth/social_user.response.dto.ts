import { SocialAuth, User } from "../../../../typs/interface/auth";

type SocialUserResponseDto = Omit<User & SocialAuth, "valid">;

export default SocialUserResponseDto;
