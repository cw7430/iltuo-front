import { IdxRequestDto } from "../../dto/request";
import {
  NativeSignInRequestDto,
  UserIdDuplicateCheckRequestDto,
  NativeSignUpRequestDto,
  AddressRequestDto,
  PasswordRequestDto,
  ProfileRequestDto,
} from "../../dto/request/Auth";
import { PlainResponseDto } from "../../dto/response";
import {
  SignInResponseDto,
  RefreshAccessTokenResponseDto,
  NativeUserResponseDto,
  SocialUserResponseDto,
  AddressResponseDto,
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
  return apiPost<PlainResponseDto>(`${DOMAIN}/check_id`, requestBody);
};

export const fetchSignUpNative = async (requestBody: NativeSignUpRequestDto) => {
  return apiPost<SignInResponseDto>(`${DOMAIN}/sign_up_native`, requestBody);
};

export const fetchNativeProfile = async () => {
  return apiGet<NativeUserResponseDto>(`${DOMAIN}/native_profile`);
};

export const fetchSocialProfile = async () => {
  return apiGet<SocialUserResponseDto>(`${DOMAIN}/social_profile`);
};

export const fetchAddressList = async () => {
  return apiGet<AddressResponseDto[]>(`${DOMAIN}/address_list`);
};

export const fetchChangePassword = async (requestBody: PasswordRequestDto) => {
  return apiPost<PlainResponseDto>(`${DOMAIN}/change_password`, requestBody);
};

export const fetchChangeProfile = async (requestBody: ProfileRequestDto) => {
  return apiPost<PlainResponseDto>(`${DOMAIN}/change_profile`, requestBody);
};

export const fetchAddAddress = async (requestBody: AddressRequestDto) => {
  return apiPost<PlainResponseDto>(`${DOMAIN}/add_address`, requestBody);
};

export const fetchCangeMainAddress = async (requestBody: IdxRequestDto) => {
  return apiPost<PlainResponseDto>(`${DOMAIN}/change_main_address`, requestBody);
};

export const fetchInvalidateAddress = async (requestBody: IdxRequestDto[]) => {
  return apiPost<PlainResponseDto>(`${DOMAIN}/invalidate_addresses`, requestBody);
};
