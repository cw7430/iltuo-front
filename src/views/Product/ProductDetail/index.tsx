import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Button, Form, InputGroup } from "react-bootstrap";
import Decimal from "decimal.js";
import { MAIN_PATH, LIST_PATH, PLAIN_PATH, DETAIL_PATH, API_PATH } from "../../../constants/url";
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
import { AlertModal, ConfirmModal } from "../../../components/Modals";
import { useAuthStore } from "../../../stores";
import { fetchAddCart, fetchAddOrder } from "../../../apis/server/Order";
import { AddOrderRequestDto } from "../../../apis/dto/request/Order";
import { ApiError } from "../../../apis/server";
import { logoutUser } from "../../../utils/auth";

interface Props {
  handleShowLoginModal: () => void;
}

export default function ProuctDetail(props: Props) {
  const { handleShowLoginModal } = props;

  const { productId } = useParams<{ productId: string }>();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<ProductResponseDto | undefined>(undefined);
  const [optionCategory, setOptionCategory] = useState<OptionResponseDto[]>([]);
  const [detailOption, setDetailOption] = useState<OptionDetailResponseDto[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [optionDetailIdArray, setOptionDetailIdArray] = useState<number[]>([]);
  const [invalidOptions, setInvalidOptions] = useState<number[]>([]);

  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertText, setAlertText] = useState<string>("");
  const [alertAction, setAlertAction] = useState<() => void>(() => {});

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmTitle, setConfirmTitle] = useState<string>("");
  const [confirmText, setConfirmText] = useState<string>("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  const quantityRef = useRef<HTMLInputElement>(null);

  const handleNavigateMainPath = useCallback(() => {
    navigate(MAIN_PATH());
  }, [navigate]);

  const showGenericConfirmModal = (title: string, text: string, onConfirm: () => void) => {
    setConfirmTitle(title);
    setConfirmText(text);
    setConfirmAction(() => () => {
      onConfirm();
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  const showGenericAlertModal = (title: string, text: string, onAlert: () => void) => {
    setAlertTitle(title);
    setAlertText(text);
    setAlertAction(() => () => {
      onAlert();
      setShowAlertModal(false);
    });
    setShowAlertModal(true);
  };

  const handleCloseAlertModal = () => setShowAlertModal(false);

  const handleAfterAlert = () => alertAction();

  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  const handleConfirm = () => confirmAction();

  const handleBack = () => {
    if (product) {
      navigate(LIST_PATH("product", product.majorCategoryId));
    } else {
      navigate(MAIN_PATH());
    }
  };

  const handleNavigeteOrderPath = (paymentId: number) => {
    navigate(DETAIL_PATH("order", paymentId));
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

  const handleAddToCart = async () => {
    if (!product) return;

    if (!quantityRef.current) return;

    if (!validateOptions()) return;

    if (!isLoggedIn) {
      showGenericAlertModal("경고", "로그인 후 이용 가능합니다.", () => {
        handleShowLoginModal();
      });
      return;
    }

    const requestBody: AddOrderRequestDto = {
      productId: product.productId,
      quantity: Number(quantityRef.current.value),
      options: optionDetailIdArray.map((idx) => ({ idx: idx })),
    };

    try {
      setIsLoading(true);
      const response = await fetchAddCart(requestBody);
      if (response) {
        showGenericConfirmModal("확인", "장바구니 페이지로 이동하시겠습니까?", () => {
          navigate(PLAIN_PATH("cart", null));
        });
      }
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.code === "UA") {
          showGenericAlertModal("세션만료", "세션이 만료되었습니다. 로그아웃합니다.", () => {
            logoutUser();
          });
        } else {
          showGenericAlertModal("오류", "서버 오류입니다. 나중에 다시 시도하세요.", () => {});
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (!quantityRef.current) return;

    if (!validateOptions()) return;

    if (!isLoggedIn) {
      showGenericAlertModal("경고", "로그인 후 이용 가능합니다.", () => {
        handleShowLoginModal();
      });
      return;
    }

    const requestBody: AddOrderRequestDto = {
      productId: product.productId,
      quantity: Number(quantityRef.current.value),
      options: optionDetailIdArray.map((idx) => ({ idx: idx })),
    };

    showGenericConfirmModal("확인", "상품을 구매하시겠습니까?", async () => {
      try {
        setIsLoading(true);
        const response = await fetchAddOrder(requestBody);
        if (response) {
          handleNavigeteOrderPath(response.idx);
        }
      } catch (e) {
        if (e instanceof ApiError) {
          if (e.code === "UA") {
            showGenericAlertModal("세션만료", "세션이 만료되었습니다. 로그아웃합니다.", () => {
              logoutUser();
            });
          } else {
            showGenericAlertModal("오류", "서버 오류입니다. 나중에 다시 시도하세요.", () => {});
          }
        }
      } finally {
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    if (productId) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const productResponse = await fetchProductDetail({
            idx: Number(productId),
          });
          setProduct(productResponse);
          if (productResponse) {
            setTotalPrice(productResponse.discountedPrice);

            if (productResponse.optionCount > 0) {
              const optionCategoryResponse = await fetchOptionList({
                idx: productResponse.majorCategoryId,
              });
              const detailOptionResponse = await fetchOptionDetailList({
                idx: productResponse.majorCategoryId,
              });
              setOptionCategory(optionCategoryResponse);
              setDetailOption(detailOptionResponse);
            }
          }
        } catch (e) {
          showGenericAlertModal("오류", "서버 오류입니다. 나중에 다시 시도하세요.", () => {
            handleNavigateMainPath();
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [productId, handleNavigateMainPath]);

  const detailOptionMap = useMemo(() => {
    return new Map(detailOption.map((opt) => [opt.optionDetailId, opt]));
  }, [detailOption]);

  return (
    <>
      <Container>
        <Row>
          <Col className="mt-5" md={6}>
            <div>
              {product ? (
                <img src={`${API_PATH}/images/product/${product.productCode}.jpg`} alt="사진" />
              ) : (
                <div>{"사진"}</div>
              )}
            </div>
          </Col>
          <Col className="mt-5" md={6}>
            <h2>{product ? product.productName : "제목"}</h2>
            <h6>{product ? product.productComments : "코멘트"}</h6>
            <h5>{product ? `${product.discountedPrice.toLocaleString()} 원` : "가격"}</h5>
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
                                  : !optionDetailIdArray[item.priorityIndex - 2]
                              }
                              onChange={(e) =>
                                handleOptionChange(item.priorityIndex, Number(e.target.value))
                              }
                              value={optionDetailIdArray[item.priorityIndex - 1] || 0}
                              isInvalid={invalidOptions.includes(item.priorityIndex)}
                            >
                              <option value={0}>{"==선택=="}</option>
                              {filteredDetails.map((detail, detailIdx) => (
                                <option key={detailIdx} value={detail.optionDetailId}>
                                  {getOptionLabel(detail)}
                                </option>
                              ))}
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
                  <td>{product ? `${totalPrice.toLocaleString()} 원` : "총액"}</td>
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
      </Container>
      {isLoading && <Loader />}
      <AlertModal
        showAlertModal={showAlertModal}
        handleCloseAlertModal={handleCloseAlertModal}
        handleAfterAlert={handleAfterAlert}
        alertTitle={alertTitle}
        alertText={alertText}
      />
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
