import { IdxRequestDto } from "../../dto/request";
import { AddCartRequestDto } from "../../dto/request/Order";
import { PlainResponseDto } from "../../dto/response";
import { CartResponseDto, CartOptionResponseDto } from "../../dto/response/Order";
import { apiGet, apiPost } from "../api.response";

const DOMAIN = "/order";

export const fetchCartList = async () => {
    return apiGet<CartResponseDto[]>(`${DOMAIN}/cart`);
};

export const fetchCartOptionList = async () => {
    return apiGet<CartOptionResponseDto[]>(`${DOMAIN}/cart_options`);
};

export const fetchAddCart = async (requestBody: AddCartRequestDto) => {
    return apiPost<PlainResponseDto>(`${DOMAIN}/add_cart`, requestBody);
};

export const fetchDeleteCart = async (requestBody: IdxRequestDto) => {
    return apiPost<PlainResponseDto>(`${DOMAIN}/delete_cart`, requestBody);
};

export const fetchDeleteCartsAll = async () => {
    return apiPost<PlainResponseDto>(`${DOMAIN}/delete_carts_all`);
};
