import axios from "axios";
import {
    ProductDetailRequestDto,
    ProductListRequestDto,
    RecommendedProductsRequestDto,
} from "../../dto/request/Products";
import {
    ProductResponseDto,
    MajorCategoryResponseDto,
    MinerCategoryResponseDto,
    OptionResponseDto,
    OptionDetailResponseDto,
} from "../../dto/response/Products";
import { chunkArray } from "../../../utils/array";
import Decimal from "decimal.js";
import { apiGet } from "../api.response";

const MOCK_DOMAIN = "http://localhost:3000";
const DOMAIN = "/product";

export const fetchMajorCategoryList = () => {
    return apiGet<MajorCategoryResponseDto[]>(`${DOMAIN}/major_category_list`);
};

export const fetchRecommendedProductList = async (
    requestBody: RecommendedProductsRequestDto
) => {
    try {
        const result = await axios.get(
            `${MOCK_DOMAIN}/mock/data/product/product_view.json`,
            {
                params: requestBody,
            }
        );
        let responseBodyRaw: ProductResponseDto[] = result.data;
        if (requestBody.isRecommended) {
            responseBodyRaw = responseBodyRaw.filter(
                (product) => product.isRecommended
            );
        }
        const reponseBodyTuned = responseBodyRaw.map((product) => ({
            ...product,
            discountedPrice: new Decimal(product.price)
                .mul(new Decimal(100).minus(product.discountedRate))
                .div(100)
                .div(10)
                .ceil()
                .mul(10)
                .toNumber(),
        }));
        const responseBody: ProductResponseDto[][] = chunkArray(
            reponseBodyTuned,
            4
        );
        return responseBody;
    } catch (error) {
        console.error("초기데이터 설정 중 오류 발생:", error);
        return [];
    }
};

export const fetchMinerCategoryList = async (
    requestBody: ProductListRequestDto
) => {
    try {
        const result = await axios.get(
            `${MOCK_DOMAIN}/mock/data/product/miner_category.json`,
            {
                params: requestBody,
            }
        );
        let responseBody: MinerCategoryResponseDto[] = result.data;
        if (requestBody.majorCategoryId) {
            responseBody = responseBody.filter(
                (minerCategory) =>
                    minerCategory.majorCategoryId ===
                    requestBody.majorCategoryId
            );
        }
        return responseBody;
    } catch (error) {
        console.error("소분류 목록 조회 중 오류 발생:", error);
        return [];
    }
};

export const fetchProductList = async (requestBody: ProductListRequestDto) => {
    try {
        const result = await axios.get(
            `${MOCK_DOMAIN}/mock/data/product/product_view.json`,
            {
                params: requestBody,
            }
        );
        let responseBody: ProductResponseDto[] = result.data;
        if (requestBody.majorCategoryId) {
            responseBody = responseBody.filter(
                (product) =>
                    product.majorCategoryId === requestBody.majorCategoryId
            );
        }
        const reponseBodyTuned = responseBody.map((product) => ({
            ...product,
            discountedPrice: new Decimal(product.price)
                .mul(new Decimal(100).minus(product.discountedRate))
                .div(100)
                .div(10)
                .ceil()
                .mul(10)
                .toNumber(),
        }));
        return reponseBodyTuned;
    } catch (error) {
        console.error("상품 목록 조회 중 오류 발생:", error);
        return [];
    }
};

export const fetchProductDetail = async (
    requestBody: ProductDetailRequestDto
) => {
    try {
        const result = await axios.get(
            `${MOCK_DOMAIN}/mock/data/product/product_view.json`,
            {
                params: requestBody,
            }
        );
        const responseBodyList: ProductResponseDto[] = result.data;
        let responseBody: ProductResponseDto | undefined = undefined;
        if (requestBody.productId) {
            responseBody = responseBodyList.find(
                (product) => product.productId === requestBody.productId
            );
        }
        if (responseBody) {
            const discountedPrice = new Decimal(responseBody.price)
                .mul(new Decimal(100).minus(responseBody.discountedRate))
                .div(100)
                .div(10)
                .ceil()
                .mul(10)
                .toNumber();

            return { ...responseBody, discountedPrice };
        } else {
            console.error("해당 productId에 대한 상품을 찾을 수 없습니다.");
            return undefined;
        }
    } catch (error) {
        console.error("상품 상세 조회 중 오류 발생:", error);
        return undefined;
    }
};

export const fetchOptionList = async (requestBody: ProductListRequestDto) => {
    try {
        const result = await axios.get(
            `${MOCK_DOMAIN}/mock/data/product/option.json`,
            {
                params: requestBody,
            }
        );
        let responseBody: OptionResponseDto[] = result.data;
        if (requestBody.majorCategoryId) {
            responseBody = responseBody.filter(
                (option) =>
                    option.majorCategoryId === requestBody.majorCategoryId
            );
        }
        return responseBody;
    } catch (error) {
        console.error("옵션 목록 조회 중 오류 발생:", error);
        return [];
    }
};

export const fetchOptionDetailList = async (
    requestBody: ProductListRequestDto
) => {
    try {
        const result = await axios.get(
            `${MOCK_DOMAIN}/mock/data/product/option_view.json`,
            {
                params: requestBody,
            }
        );
        let responseBody: OptionDetailResponseDto[] = result.data;
        if (requestBody.majorCategoryId) {
            responseBody = responseBody.filter(
                (option) =>
                    option.majorCategoryId === requestBody.majorCategoryId
            );
        }
        return responseBody;
    } catch (error) {
        console.error("옵션 목록 조회 중 오류 발생:", error);
        return [];
    }
};
