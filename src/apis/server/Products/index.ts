import axios from "axios";
import { ProductListRequestDto, RecommendatedProductsRequestDto } from "../../dto/request/Products";
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
        const responseBody: ProductResponseDto[][] = chunkArray(responseBodyRaw, 4)
        return responseBody;
    } catch (error) {
        console.error("초기데이터 설정 중 오류 발생:", error);
        return [];
    }
};

export const fetchMinerCategoryList = async(requestBody: ProductListRequestDto) => {
    try {
        const result = await axios.get(
            `${DOMAIN}/mock/data/product/miner_category.json`,
            {
                params: requestBody,
            }
        );
        let responseBody: MinerCategoryResponseDto[] = result.data;
        return responseBody;
    } catch (error) {
        console.error("소분류 목록 조회 중 오류 발생:", error);
        return [];
    }
}
