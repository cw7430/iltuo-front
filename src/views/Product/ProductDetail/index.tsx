import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { MAIN_PATH, LIST_PATH } from "../../../constants";
import Loader from "../../../components/Loader";
import { ProductResponseDto } from "../../../apis/dto/response/Products";

export default function ProuctDetail() {
    const productId = useParams<{ productId: string }>();

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

    return (
        <Container>
            {isLoading ? (
                <div className="d-flex justify-content-center my-5">
                    <Loader />
                </div>
            ) : (
                <Row>
                    <Col className="mt-5" md={6}>
                        <div>{"사진"}</div>
                    </Col>
                    <Col className="mt-5" md={6}>
                        <h2>{"제목"}</h2>
                        <h6>{"코멘트"}</h6>
                        <p>{"가격"}</p>
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
