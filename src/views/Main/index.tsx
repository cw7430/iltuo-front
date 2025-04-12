import React from "react";
import { Col, Container, Row, Carousel } from "react-bootstrap";
import { ProductCard } from "../../components/Cards";
import { useRecommendatedProductStore } from "../../stores";

export default function Main() {
    const recommendatedProductList = useRecommendatedProductStore(
        (state) => state.data
    );

    return (
        <div className="coffee_section layout_padding">
            <Container>
                <Row>
                    <Col md={12}>
                        <h1 className="coffee_taital">추천상품</h1>
                    </Col>
                </Row>
            </Container>
            <div className="coffee_section_2">
                <Carousel id="main_slider" indicators={false}>
                    {recommendatedProductList.map((group, groupIdx) => (
                        <Carousel.Item key={groupIdx}>
                            <Container fluid>
                                <Row className="justify-content-center align-items-stretch">
                                    {group.map((item, itemIdx) => (
                                        <Col
                                            lg={3}
                                            md={6}
                                            sm={12}
                                            className="mb-4 d-flex"
                                            key={itemIdx}
                                        >
                                            <ProductCard product={item} isMainPage={true} />
                                        </Col>
                                    ))}
                                </Row>
                            </Container>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </div>
    );
}
