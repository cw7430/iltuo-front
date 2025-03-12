import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMajorCategoryStore } from "../../../stores";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
    MinerCategoryResponseDto,
    ProductResponseDto,
} from "../../../apis/dto/response/Products";
import {
    fetchMinerCategoryList,
    fetchProductList,
} from "../../../apis/server/Products";
import Loader from "../../../components/Loader";

export default function ProductList() {
    const { majorCategoryId } = useParams<{ majorCategoryId: string }>();
    const majorCategoryList = useMajorCategoryStore((state) => state.data);

    const majorCategoryName = majorCategoryList.find(
        (category) => category.majorCategoryId === Number(majorCategoryId)
    )?.majorCategoryName;

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [minerCategoryList, setMinerCategoryList] = useState<
        MinerCategoryResponseDto[]
    >([]);
    const [productList, setProductList] = useState<ProductResponseDto[]>([]);
    const [filteredProductList, setFilteredProductList] =
        useState<ProductResponseDto[]>(productList);
    const [minerCategoryId, setMinerCategoryId] = useState<string>("0");

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
    }, [majorCategoryId]);

    useEffect(() => {
        const filterProducts = () => {
            if (minerCategoryId === "0") {
                setFilteredProductList(productList);
            } else {
                const filtered = productList.filter(
                    (product) =>
                        String(product.minerCategoryId) === minerCategoryId
                );
                setFilteredProductList(filtered);
            }
        };

        filterProducts();
    }, [minerCategoryId, productList]);

    const handleChangeMinerCategoryId = (categoryId: string) => {
        setMinerCategoryId(categoryId);
    };

    console.log(filteredProductList);

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
                    <div className="coffee_section_2"></div>
                </>
            )}
        </div>
    );
}
