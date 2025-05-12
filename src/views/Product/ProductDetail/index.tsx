import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Button, Form, InputGroup } from "react-bootstrap";
import Decimal from "decimal.js";
import { MAIN_PATH, LIST_PATH } from "../../../constants/url";
import { Loader } from "../../../components/Gif";
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
import { ConfirmModal } from "../../../components/Modals";

export default function ProuctDetail() {
    const { productId } = useParams<{ productId: string }>();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [product, setProduct] = useState<ProductResponseDto | undefined>(undefined);
    const [optionCategory, setOptionCategory] = useState<OptionResponseDto[]>([]);
    const [detailOption, setDetailOption] = useState<OptionDetailResponseDto[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [optionDetailIdArray, setOptionDetailIdArray] = useState<number[]>([]);
    const [invalidOptions, setInvalidOptions] = useState<number[]>([]);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>("");
    const [confirmText, setConfirmText] = useState<string>("");
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

    const quantityRef = useRef<HTMLInputElement>(null);

    const showGenericConfirmModal = (title: string, text: string, onConfirm: () => void) => {
        setConfirmTitle(title);
        setConfirmText(text);
        setConfirmAction(() => () => {
            onConfirm();
            setShowConfirmModal(false); // 모달 닫기
        });
        setShowConfirmModal(true);
    };

    const handleCloseConfirmModal = () => setShowConfirmModal(false);

    const handleConfirm = () => confirmAction();

    const handleBack = () => {
        if (product) {
            navigate(LIST_PATH("product", product.majorCategoryId));
        } else {
            navigate(MAIN_PATH());
        }
    };

    const sanitizeQuantity = (value: number): number => {
        if (isNaN(value) || value <= 0) return 1;
        if (value > 99) return 99;
        return value;
    };

    const updateTotalPrice = (quantity: number) => {
        calculateTotalPrice(quantity, optionDetailIdArray);
    };

    const getQuantity = (): number => {
        const input = quantityRef.current;
        if (!input) return 1;

        const value = Number(input.value);
        return sanitizeQuantity(value);
    };

    const handleQuantityFormat = (event: React.FormEvent<HTMLInputElement>) => {
        const formattedValue = event.currentTarget.value.replace(/[^0-9]/g, "");

        const input = quantityRef.current;
        if (!input) return;

        input.value = formattedValue;

        const quantity = sanitizeQuantity(Number(formattedValue || "1"));
        updateTotalPrice(quantity);
    };

    const handleQuantityBlur = () => {
        const input = quantityRef.current;
        if (!input) return;

        const raw = Number(input.value);
        const quantity = sanitizeQuantity(raw);

        input.value = quantity.toString();
        updateTotalPrice(quantity);
    };

    const getOptionDelta = (basePrice: number, option: OptionDetailResponseDto): number => {
        if (option.optionTypeCode === "OPT002") {
            return option.optionFluctuatingPrice;
        } else if (option.optionTypeCode === "OPT001") {
            const percentage = new Decimal(option.optionFluctuatingPrice).minus(100);
            const result = new Decimal(basePrice).mul(percentage).div(100).div(10).floor().mul(10);
            return result.toNumber();
        }
        return 0;
    };

    const applyOptionPrice = (basePrice: number, option: OptionDetailResponseDto): number => {
        const delta = getOptionDelta(basePrice, option);
        return basePrice + delta;
    };

    const formatPriceDelta = (delta: number): string => {
        const prefix = delta >= 0 ? "+" : "-";
        return `${prefix}${Math.abs(delta).toLocaleString()}원`;
    };

    const calculateTotalPrice = (quantity: number, selectedOptionIds: number[]) => {
        if (!product) return;

        let basePrice = product.discountedPrice * quantity;

        selectedOptionIds.forEach((id) => {
            const option = detailOptionMap.get(id);
            if (!option) return;
            basePrice = applyOptionPrice(basePrice, option);
        });

        setTotalPrice(basePrice);
    };

    const getOptionLabel = (option: OptionDetailResponseDto): string => {
        if (!product) return option.optionDetailName;

        const quantity = getQuantity();
        let basePrice = product.discountedPrice * quantity;

        optionDetailIdArray.forEach((id, idx) => {
            const opt = detailOptionMap.get(id);
            if (!opt || idx + 1 >= option.priorityIndex) return;
            basePrice = applyOptionPrice(basePrice, opt);
        });

        const delta = getOptionDelta(basePrice, option);
        return `${option.optionDetailName} (${formatPriceDelta(delta)})`;
    };

    const handleOptionChange = (priorityIndex: number, selectedId: number) => {
        const newOptionDetailIdArray = [...optionDetailIdArray];

        if (selectedId === 0) {
            const truncated = newOptionDetailIdArray.slice(0, priorityIndex - 1);
            setOptionDetailIdArray(truncated);
            calculateTotalPrice(getQuantity(), truncated);
        } else {
            newOptionDetailIdArray[priorityIndex - 1] = selectedId;
            const truncated = newOptionDetailIdArray.slice(0, priorityIndex);
            setOptionDetailIdArray(truncated);
            calculateTotalPrice(getQuantity(), truncated);
            setInvalidOptions((prev) => prev.filter((idx) => idx !== priorityIndex));
        }
    };

    const validateOptions = (): boolean => {
        const invalid = optionCategory
            .filter((cat) => {
                const selectedId = optionDetailIdArray[cat.priorityIndex - 1];
                return !selectedId || selectedId === 0;
            })
            .map((cat) => cat.priorityIndex);

        setInvalidOptions(invalid);
        return invalid.length === 0;
    };

    const handleAddToCart = () => {
        if (!validateOptions()) return;
        // 실제 장바구니 로직 여기에
        showGenericConfirmModal("확인", "장바구니 페이지로 이동하시겠습니까?", () => {
            console.log("✅ 장바구니 이동");
        });
    };

    const handleBuyNow = () => {
        if (!validateOptions()) return;
        showGenericConfirmModal("확인", "상품을 구매하시겠습니까?", () => {
            console.log("✅ 상품 구매 처리 로직 실행");
        });
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

                        if (productResponse.optionCount > 0) {
                            const optionCategoryResponse = await fetchOptionList({
                                majorCategoryId: productResponse.majorCategoryId,
                            });
                            const detailOptionResponse = await fetchOptionDetailList({
                                majorCategoryId: productResponse.majorCategoryId,
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

    const detailOptionMap = useMemo(() => {
        return new Map(detailOption.map((opt) => [opt.optionDetailId, opt]));
    }, [detailOption]);


    return (
        <>
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
                                        <th scope="row" style={{ width: "100px" }}>
                                            {"수량"}
                                        </th>
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
                                    {product &&
                                        product.optionCount > 0 &&
                                        optionCategory.map((item) => {
                                            const filteredDetails = detailOption.filter(
                                                (detail) => detail.optionId === item.optionId
                                            );

                                            return (
                                                <tr key={item.priorityIndex}>
                                                    <th scope="row">{item.optionName}</th>
                                                    <td>
                                                        <InputGroup
                                                            style={{
                                                                maxWidth: "450px",
                                                            }}
                                                        >
                                                            <Form.Select
                                                                disabled={
                                                                    item.priorityIndex === 1
                                                                        ? false
                                                                        : !optionDetailIdArray[
                                                                              item.priorityIndex - 2
                                                                          ]
                                                                }
                                                                onChange={(e) =>
                                                                    handleOptionChange(
                                                                        item.priorityIndex,
                                                                        Number(e.target.value)
                                                                    )
                                                                }
                                                                value={
                                                                    optionDetailIdArray[
                                                                        item.priorityIndex - 1
                                                                    ] || 0
                                                                }
                                                                isInvalid={invalidOptions.includes(
                                                                    item.priorityIndex
                                                                )}
                                                            >
                                                                <option value={0}>
                                                                    {"==선택=="}
                                                                </option>
                                                                {filteredDetails.map(
                                                                    (detail, detailIdx) => (
                                                                        <option
                                                                            key={detailIdx}
                                                                            value={
                                                                                detail.optionDetailId
                                                                            }
                                                                        >
                                                                            {getOptionLabel(detail)}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </Form.Select>
                                                            <Form.Control.Feedback type="invalid">
                                                                {"옵션을 선택해주세요"}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    <tr>
                                        <th scope="row">{"총 상품 가격"}</th>
                                        <td>
                                            {product ? `${totalPrice.toLocaleString()} 원` : "총액"}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                            <div className="d-flex justify-content-end align-items-center gap-2 mt-5 mb-5">
                                <Button variant="primary" onClick={handleAddToCart}>
                                    {"장바구니"}
                                </Button>
                                <Button variant="danger" onClick={handleBuyNow}>
                                    {"바로구매"}
                                </Button>
                                <Button variant="info" onClick={handleBack}>
                                    {"목록으로"}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                )}
            </Container>
            <ConfirmModal
                showConfirmModal={showConfirmModal}
                handleCloseConfirmModal={handleCloseConfirmModal}
                handleConfirm={handleConfirm}
                confirmTitle={confirmTitle}
                confirmText={confirmText}
            />
        </>
    );
}
