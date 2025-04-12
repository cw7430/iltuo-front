import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { MAIN_PATH, LIST_PATH } from "../../../constants";
import Loader from "../../../components/Loader";
import { ProductResponseDto } from "../../../apis/dto/response/Products";
import { fetchProductDetail } from "../../../apis/server/Products";

export default function ProuctDetail() {
    const { productId } = useParams<{ productId: string }>();
    console.log(Number(productId));

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [product, setProduct] = useState<ProductResponseDto | undefined>(
        undefined
    );

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
                                ? `${product.price.toLocaleString()} 원`
                                : "가격"}
                        </h5>
                        <Table>
                            <tbody>
                                <tr>
                                    <th scope="row">{"수량"}</th>
                                    <td>{"숫자조절"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">{"옵션"}</th>
                                    <td>{"욥션조절"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">{"총 상품 가격"}</th>
                                    <td>{"총액"}</td>
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
