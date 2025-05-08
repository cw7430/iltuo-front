import { ProductDetailRequestDto, ProductListRequestDto } from "../../dto/request/Products";
import {
    ProductResponseDto,
    MajorCategoryResponseDto,
    MinerCategoryResponseDto,
    OptionResponseDto,
    OptionDetailResponseDto,
} from "../../dto/response/Products";
import { apiGet } from "../api.response";

const DOMAIN = "/product";

export const fetchMajorCategoryList = () => {
    return apiGet<MajorCategoryResponseDto[]>(`${DOMAIN}/major_category_list`);
};

export const fetchRecommendedProductList = async () => {
    return apiGet<ProductResponseDto[]>(`${DOMAIN}/recommended_product_list`);
};

export const fetchMinerCategoryList = async (requestBody: ProductListRequestDto) => {
    return apiGet<MinerCategoryResponseDto[]>(`${DOMAIN}/miner_category_list`, requestBody);
};

export const fetchProductList = async (requestBody: ProductListRequestDto) => {
    return apiGet<ProductResponseDto[]>(`${DOMAIN}/product_list`, requestBody);
};

export const fetchProductDetail = async (requestBody: ProductDetailRequestDto) => {
    return apiGet<ProductResponseDto>(`${DOMAIN}/product_detail`, requestBody);
};

export const fetchOptionList = async (requestBody: ProductListRequestDto) => {
    return apiGet<OptionResponseDto[]>(`${DOMAIN}/option_list`, requestBody);
};

export const fetchOptionDetailList = async (requestBody: ProductListRequestDto) => {
    return apiGet<OptionDetailResponseDto[]>(`${DOMAIN}/option_detail_list`, requestBody);
};
