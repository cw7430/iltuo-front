import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMajorCategoryStore } from "../../../stores";
import { Container, Row, Col, Button, Nav } from "react-bootstrap";
import {
    MinerCategoryResponseDto,
    ProductResponseDto,
} from "../../../apis/dto/response/Products";
import {
    fetchMinerCategoryList,
    fetchProductList,
} from "../../../apis/server/Products";
import Loader from "../../../components/Loader";
import { ProductCard } from "../../../components/Cards";
import CustomPagination from "../../../components/CustomPagination";
import { sortDate, sortNumber } from "../../../utils/sort";

export default function ProductList() {
    const { majorCategoryId } = useParams<{ majorCategoryId: string }>();
    const majorCategoryList = useMajorCategoryStore((state) => state.data);

    const majorCategoryName = majorCategoryList.find(
        (category) => category.majorCategoryId === Number(majorCategoryId)
    )?.majorCategoryName;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [minerCategoryList, setMinerCategoryList] = useState<
        MinerCategoryResponseDto[]
    >([]);
    const [productList, setProductList] = useState<ProductResponseDto[]>([]);
    const [pagedProductList, setPagedProductList] = useState<
        ProductResponseDto[]
    >([]);
    const [minerCategoryId, setMinerCategoryId] = useState<string>("0");
    const [sortKey, setSortKey] = useState<
        "RecommendedAsc" | "registerDateDesc" | "priceAsc" | "priceDesc"
    >("RecommendedAsc");

    const handleChangeMinerCategoryId = (categoryId: string) => {
        setMinerCategoryId(categoryId);
        handleSort("RecommendedAsc");
    };

    const handleSort = (
        key: "RecommendedAsc" | "registerDateDesc" | "priceAsc" | "priceDesc"
    ) => {
        setSortKey(key);
    };

    useEffect(() => {
        if (majorCategoryId) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const minerCategoryResponse = await fetchMinerCategoryList({
                        majorCategoryId: Number(majorCategoryId),
                    });
                    const productResponse = await fetchProductList({
                        majorCategoryId: Number(majorCategoryId),
                    });
                    setMinerCategoryList(minerCategoryResponse);
                    setProductList(productResponse);
                } catch (error) {
                    console.error("Failed to fetch data", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
        setMinerCategoryId("0");
        setSortKey("RecommendedAsc");
    }, [majorCategoryId]);

    const filteredAndSortedList = useMemo(() => {
        let filteredList =
            minerCategoryId === "0"
                ? productList
                : productList.filter(
                      (product) =>
                          String(product.minerCategoryId) === minerCategoryId
                  );

        switch (sortKey) {
            case "registerDateDesc":
                return sortDate(filteredList, "registerDate", "desc");
            case "priceAsc":
                return sortNumber(filteredList, "discountedPrice", "asc");
            case "priceDesc":
                return sortNumber(filteredList, "discountedPrice", "desc");
            case "RecommendedAsc":
            default:
                return filteredList;
        }
    }, [productList, minerCategoryId, sortKey]);

    return (
        <div className="coffee_section layout_padding">
            <Container>
                <Row>
                    <Col md={12}>
                        <h1 className="coffee_taital">
                            {majorCategoryName || "카테고리 없음"}
                        </h1>
                    </Col>
                </Row>
            </Container>

            {isLoading ? (
                <div className="d-flex justify-content-center my-5">
                    <Loader />
                </div>
            ) : (
                <>
                    <Container>
                        <Row className="my-5 justify-content-center">
                            <Col xs="auto">
                                <Button
                                    variant="outline-secondary"
                                    active={minerCategoryId === "0"}
                                    onClick={() =>
                                        handleChangeMinerCategoryId("0")
                                    }
                                >
                                    {"전체"}
                                </Button>
                            </Col>
                            {minerCategoryList.map((item, itemIdx) => (
                                <Col xs="auto" key={itemIdx}>
                                    <Button
                                        variant="outline-secondary"
                                        active={
                                            minerCategoryId ===
                                            String(item.minerCategoryId)
                                        }
                                        onClick={() =>
                                            handleChangeMinerCategoryId(
                                                String(item.minerCategoryId)
                                            )
                                        }
                                    >
                                        {item.minerCategoryName}
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                    <div className="coffee_section_2">
                        <Container>
                            <Row className="my-5 justify-content-end">
                                <Col xs="auto" className="d-flex">
                                    <Nav.Link
                                        as="button"
                                        disabled={
                                            sortKey === "RecommendedAsc"
                                        }
                                        style={{
                                            fontWeight:
                                                sortKey === "RecommendedAsc"
                                                    ? "bold"
                                                    : "normal",
                                        }}
                                        onClick={() =>
                                            handleSort("RecommendedAsc")
                                        }
                                    >
                                        {"추천순"}
                                    </Nav.Link>
                                </Col>
                                <Col xs="auto" className="d-flex">
                                    <Nav.Link
                                        as="button"
                                        disabled={
                                            sortKey === "registerDateDesc"
                                        }
                                        style={{
                                            fontWeight:
                                                sortKey === "registerDateDesc"
                                                    ? "bold"
                                                    : "normal",
                                        }}
                                        onClick={() =>
                                            handleSort("registerDateDesc")
                                        }
                                    >
                                        {"등록순"}
                                    </Nav.Link>
                                </Col>
                                <Col xs="auto" className="d-flex">
                                    <Nav.Link
                                        as="button"
                                        disabled={sortKey === "priceAsc"}
                                        style={{
                                            fontWeight:
                                                sortKey === "priceAsc"
                                                    ? "bold"
                                                    : "normal",
                                        }}
                                        onClick={() => handleSort("priceAsc")}
                                    >
                                        {"낮은가격순"}
                                    </Nav.Link>
                                </Col>
                                <Col xs="auto" className="d-flex">
                                    <Nav.Link
                                        as="button"
                                        disabled={sortKey === "priceDesc"}
                                        style={{
                                            fontWeight:
                                                sortKey === "priceDesc"
                                                    ? "bold"
                                                    : "normal",
                                        }}
                                        onClick={() => handleSort("priceDesc")}
                                    >
                                        {"높은가격순"}
                                    </Nav.Link>
                                </Col>
                            </Row>
                            <Row className="my-5 d-flex align-items-stretch">
                                {pagedProductList.map((item, itemIdx) => (
                                    <Col
                                        lg={3}
                                        md={6}
                                        className="mb-4 d-flex"
                                        key={itemIdx}
                                    >
                                        <ProductCard
                                            product={item}
                                            isMainPage={false}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                        <Container>
                            <Row className="my-5 justify-content-center">
                                <Col xs="auto">
                                    <CustomPagination
                                        data={filteredAndSortedList}
                                        itemsPerPage={4}
                                        pageBlockSize={5}
                                        setPagedData={setPagedProductList}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </>
            )}
        </div>
    );
}
