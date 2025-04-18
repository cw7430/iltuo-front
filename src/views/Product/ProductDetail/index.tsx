import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { MAIN_PATH, LIST_PATH } from "../../../constants";
import Loader from "../../../components/Loader";
import {
    ProductResponseDto,
    OptionResponseDto,
    OptionDetailResponseDto,
} from "../../../apis/dto/response/Products";
import {
    fetchProductDetail,
    fetchOptionList,
    fetchOptionDetailList,
} from "../../../apis/server/Products";

export default function ProuctDetail() {
    const { productId } = useParams<{ productId: string }>();
    console.log(Number(productId));

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [product, setProduct] = useState<ProductResponseDto | undefined>(
        undefined
    );
    const [optionCategory, setOptionCategory] = useState<OptionResponseDto[]>(
        []
    );
    const [detailOption, setDetailOption] = useState<OptionDetailResponseDto[]>(
        []
    );
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const handleBack = () => {
        if (product) {
            navigate(LIST_PATH("product", product.majorCategoryId));
        } else {
            navigate(MAIN_PATH());
        }
    };

    useEffect(() => {
        if (productId) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const productResponse = await fetchProductDetail({
                        productId: Number(productId),
                    });
                    setProduct(productResponse);
                    if (productResponse) {
                        setTotalPrice(productResponse.discountedPrice);
                        if (productResponse?.hasOption) {
                            const optionCategoryResponse =
                                await fetchOptionList({
                                    majorCategoryId:
                                        productResponse.majorCategoryId,
                                });
                            const detailOptionResponse =
                                await fetchOptionDetailList({
                                    majorCategoryId:
                                        productResponse.majorCategoryId,
                                });
                            setOptionCategory(optionCategoryResponse);
                            setDetailOption(detailOptionResponse);
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch data", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [productId]);

    return (
        <Container>
            {isLoading ? (
                <div className="d-flex justify-content-center my-5">
                    <Loader />
                </div>
            ) : (
                <Row>
                    <Col className="mt-5" md={6}>
                        <div>
                            {product ? (
                                <img
                                    src={`http://localhost:3000/mock/images/product/${product.productCode}.jpg`}
                                    alt="사진"
                                />
                            ) : (
                                <div>{"사진"}</div>
                            )}
                        </div>
                    </Col>
                    <Col className="mt-5" md={6}>
                        <h2>{product ? product.productName : "제목"}</h2>
                        <h6>{product ? product.productComments : "코멘트"}</h6>
                        <h5>
                            {product
                                ? `${product.discountedPrice.toLocaleString()} 원`
                                : "가격"}
                        </h5>
                        <Table>
                            <tbody>
                                <tr>
                                    <th scope="row">{"수량"}</th>
                                    <td>{"숫자조절"}</td>
                                </tr>
                                {product?.hasOption &&
                                    optionCategory.map((item, itemIdx) => {
                                        const filteredDetails =
                                            detailOption.filter(
                                                (detail) =>
                                                    detail.optionId ===
                                                    item.optionId
                                            );

                                        return (
                                            <tr key={itemIdx}>
                                                <th scope="row">
                                                    {item.optionName}
                                                </th>
                                                <td>
                                                    {filteredDetails.map(
                                                        (detail, detailIdx) => (
                                                            <span
                                                                key={detailIdx}
                                                            >
                                                                {
                                                                    detail.optionDetailName
                                                                }
                                                                {detailIdx !==
                                                                    filteredDetails.length -
                                                                        1 &&
                                                                    ", "}
                                                            </span>
                                                        )
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                <tr>
                                    <th scope="row">{"총 상품 가격"}</th>
                                    <td>
                                        {product
                                            ? `${totalPrice.toLocaleString()} 원`
                                            : "총액"}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <div className="d-flex justify-content-end align-items-center gap-2 mt-5 mb-5">
                            <Button variant="primary">{"장바구니"}</Button>
                            <Button variant="danger">{"바로구매"}</Button>
                            <Button variant="info" onClick={handleBack}>
                                {"목록으로"}
                            </Button>
                        </div>
                    </Col>
                </Row>
            )}
        </Container>
    );
}
