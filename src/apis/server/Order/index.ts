import { IdxRequestDto } from "../../dto/request";
import { AddOrderRequestDto, AddPaymentRequestDto } from "../../dto/request/Order";
import { IdxResponseDto, PlainResponseDto } from "../../dto/response";
import {
  CartResponseDto,
  OrderGroupResponseDto,
  PaymentResponseDto,
} from "../../dto/response/Order";
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

export const fetchOrderData = async (requestBody: IdxRequestDto) => {
  return apiGet<OrderGroupResponseDto>(`${DOMAIN}/order`, requestBody);
};

export const fetchOrderList = async () => {
  return apiGet<OrderGroupResponseDto[]>(`${DOMAIN}/order_list`);
};

export const fetchAddOrder = async (requestBody: AddOrderRequestDto) => {
  return apiPost<IdxResponseDto>(`${DOMAIN}/add_order`, requestBody);
};

export const fetchAddOrders = async (requestBody: AddOrderRequestDto[]) => {
  return apiPost<IdxResponseDto>(`${DOMAIN}/add_orders`, requestBody);
};

export const fetchDeleteOrder = async (requestBody: IdxRequestDto) => {
  return apiPost<PlainResponseDto>(`${DOMAIN}/delete_order`, requestBody);
};

export const fetchAddPayment = async (requestBody: AddPaymentRequestDto) => {
  return apiPost<PlainResponseDto>(`${DOMAIN}/add_payment`, requestBody);
};

export const fetchPayment = async (requestBody: IdxRequestDto) => {
  return apiGet<PaymentResponseDto>(`${DOMAIN}/payment`, requestBody);
};
