import { NativeSignInRequestDto } from "../../dto/request/Auth";
import { SignInResponseDto } from "../../dto/response/Auth";
import RefreshAccessTokenResponseDto from "../../dto/response/Auth/refresh_access_token.response.dto";
import { apiGet, apiPost } from "../api.response";

const DOMAIN = "/auth";

export const fetchSignInNative = async (requestBody:NativeSignInRequestDto) => {
    return apiPost<SignInResponseDto>(`${DOMAIN}/sign_in_native`, requestBody)
}

export const fetchCheckLogin = async () => {
    return apiGet<RefreshAccessTokenResponseDto>(`${DOMAIN}/major_category_list`);
}