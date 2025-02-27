import axios from "axios";
import { RecommendatedProductsRequestDto } from "../../dto/request/Products";
import {
    ProductResponseDto,
    MajorCategoryResponseDto,
} from "../../dto/response/Products";

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
        return null;
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
        let responseBody: ProductResponseDto[] = result.data;
        if (requestBody.isRecommendated) {
            responseBody = responseBody.filter(
                (product) => product.isRecommendated
            );
        }
        return responseBody;
    } catch (error) {
        console.error("초기데이터 설정 중 오류 발생:", error);
        return null;
    }
};
