import axios from "axios";
import {
    ProductDetailRequestDto,
    ProductListRequestDto,
    RecommendatedProductsRequestDto,
} from "../../dto/request/Products";
import {
    ProductResponseDto,
    MajorCategoryResponseDto,
    MinerCategoryResponseDto,
} from "../../dto/response/Products";
import { chunkArray } from "../../../utils/array";

const DOMAIN = "http://localhost:3000";

export const fetchMajorCategoryList = async () => {
    try {
        const result = await axios.get(
            `${DOMAIN}/mock/data/product/major_category.json`
        );
        const responseBody: MajorCategoryResponseDto[] = result.data;
        return responseBody;
    } catch (error) {
        console.error("초기데이터 설정 중 오류 발생:", error);
        return [];
    }
};

export const fetchRecommendatedProductList = async (
    requestBody: RecommendatedProductsRequestDto
) => {
    try {
        const result = await axios.get(
            `${DOMAIN}/mock/data/product/product_view.json`,
            {
                params: requestBody,
            }
        );
        let responseBodyRaw: ProductResponseDto[] = result.data;
        if (requestBody.isRecommendated) {
            responseBodyRaw = responseBodyRaw.filter(
                (product) => product.isRecommendated
            );
        }
        const reponseBodyTuned = responseBodyRaw.map((product) => ({
            ...product,
            discountedPrice:
                Math.ceil(
                    (product.price * (100 - product.discountedRate)) / 100 / 10
                ) * 10,
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
            `${DOMAIN}/mock/data/product/miner_category.json`,
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
            `${DOMAIN}/mock/data/product/product_view.json`,
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
            discountedPrice:
                Math.ceil(
                    (product.price * (100 - product.discountedRate)) / 100 / 10
                ) * 10,
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
            `${DOMAIN}/mock/data/product/product_view.json`,
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
            const discountedPrice =
                Math.ceil(
                    (responseBody.price * (100 - responseBody.discountedRate)) /
                        100 /
                        10
                ) * 10;

            return { ...responseBody, discountedPrice };
        } else {
            console.error("해당 productId에 대한 상품을 찾을 수 없습니다.");
            return {};
        }
    } catch (error) {
        console.error("상품 상세 조회 중 오류 발생:", error);
        return {};
    }
};
