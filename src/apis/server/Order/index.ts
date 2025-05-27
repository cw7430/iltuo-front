import { IdxRequestDto } from "../../dto/request";
import { AddOrderRequestDto } from "../../dto/request/Order";
import { PlainResponseDto } from "../../dto/response";
import { CartResponseDto } from "../../dto/response/Order";
import { apiGet, apiPost } from "../api.response";

const DOMAIN = "/order";

export const fetchCartList = async () => {
    return apiGet<CartResponseDto[]>(`${DOMAIN}/cart`);
};

export const fetchAddCart = async (requestBody: AddOrderRequestDto) => {
    return apiPost<PlainResponseDto>(`${DOMAIN}/add_cart`, requestBody);
};

export const fetchDeleteCart = async (requestBody: IdxRequestDto) => {
    return apiPost<PlainResponseDto>(`${DOMAIN}/delete_cart`, requestBody);
};

export const fetchDeleteCartsAll = async () => {
    return apiPost<PlainResponseDto>(`${DOMAIN}/delete_carts_all`);
};
