import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Table,
    Button,
    Form,
    InputGroup,
} from "react-bootstrap";
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
    const [optionDetailIdArray, setOptionDetailIdArray] = useState<number[]>(
        []
    );

    const quantityRef = useRef<HTMLInputElement>(null);

    const handleBack = () => {
        if (product) {
            navigate(LIST_PATH("product", product.majorCategoryId));
        } else {
            navigate(MAIN_PATH());
        }
    };

    const handleQuantityFormat = (event: React.FormEvent<HTMLInputElement>) => {
        const inputValue = event.currentTarget.value;
        const formattedValue = inputValue.replace(/[^0-9]/g, "");
        if (quantityRef.current) {
            quantityRef.current.value = formattedValue;
        }
    };

    const handleQuantityBlur = () => {
        if (quantityRef.current) {
            const currentValue = quantityRef.current.value;
            if (!currentValue || Number(currentValue) <= 0) {
                quantityRef.current.value = "1";
            }
            if (Number(currentValue) > 99) {
                quantityRef.current.value = "99";
            }
        }
    };

    const handleOptionChange = (priorityIndex: number, selectedId: number) => {
        const newOptionDetailIdArray = [...optionDetailIdArray];

        // 선택값이 "==선택=="이면 하위 옵션 제거
        if (selectedId === 0) {
            setOptionDetailIdArray(
                newOptionDetailIdArray.slice(0, priorityIndex - 1)
            );
        } else {
            newOptionDetailIdArray[priorityIndex - 1] = selectedId;
            setOptionDetailIdArray(
                newOptionDetailIdArray.slice(0, priorityIndex)
            );
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
                                    <td>
                                        <InputGroup style={{ width: "80px" }}>
                                            <Form.Control
                                                type="number"
                                                ref={quantityRef}
                                                defaultValue={1}
                                                min={1}
                                                max={99}
                                                onInput={handleQuantityFormat}
                                                onBlur={handleQuantityBlur}
                                            />
                                        </InputGroup>
                                    </td>
                                </tr>
                                {product?.hasOption &&
                                    optionCategory.map((item) => {
                                        const filteredDetails =
                                            detailOption.filter(
                                                (detail) =>
                                                    detail.optionId ===
                                                    item.optionId
                                            );

                                        return (
                                            <tr key={item.priorityIndex}>
                                                <th scope="row">
                                                    {item.optionName}
                                                </th>
                                                <td>
                                                    <Form.Select
                                                        disabled={
                                                            item.priorityIndex ===
                                                            1
                                                                ? false
                                                                : !optionDetailIdArray[
                                                                      item.priorityIndex -
                                                                          2
                                                                  ]
                                                        }
                                                        onChange={(e) =>
                                                            handleOptionChange(
                                                                item.priorityIndex,
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                        value={
                                                            optionDetailIdArray[
                                                                item.priorityIndex -
                                                                    1
                                                            ] || 0
                                                        }
                                                    >
                                                        <option value={0}>
                                                            {"==선택=="}
                                                        </option>
                                                        {filteredDetails.map(
                                                            (detail) => (
                                                                <option
                                                                    key={
                                                                        detail.optionDetailId
                                                                    }
                                                                    value={
                                                                        detail.optionDetailId
                                                                    }
                                                                >
                                                                    {
                                                                        detail.optionDetailName
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </Form.Select>
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
