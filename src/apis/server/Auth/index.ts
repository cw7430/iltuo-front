import {
    NativeSignInRequestDto,
    UserIdDuplicateCheckRequestDto,
    NativeSignUpRequestDto,
} from "../../dto/request/Auth";
import {
    SignInResponseDto,
    RefreshAccessTokenResponseDto,
    UserIdDuplicateCheckResponseDto,
} from "../../dto/response/Auth";
import { apiGet, apiPost } from "../api.response";

const DOMAIN = "/auth";

export const fetchSignInNative = async (requestBody: NativeSignInRequestDto) => {
    return apiPost<SignInResponseDto>(`${DOMAIN}/sign_in_native`, requestBody);
};

export const fetchLogout = async () => {
    return apiGet(`${DOMAIN}/logout`);
};

export const fetchRefresh = async () => {
    return apiGet<RefreshAccessTokenResponseDto>(`${DOMAIN}/refresh_Token`);
};

export const fetchCheckUserIdDuplicate = async (requestBody: UserIdDuplicateCheckRequestDto) => {
    return apiPost<UserIdDuplicateCheckResponseDto>(`${DOMAIN}/check_id`, requestBody);
};

export const fetchSignUpNative = async (requestBody: NativeSignUpRequestDto) => {
    return apiPost<SignInResponseDto>(`${DOMAIN}/sign_up_native`, requestBody);
};