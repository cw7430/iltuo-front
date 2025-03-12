import React from "react";
import { Col, Container, Row, Carousel, Card } from "react-bootstrap";
import { useRecommendatedProductStore } from "../../stores";

export default function Main() {
    const recommendatedProductList = useRecommendatedProductStore(
        (state) => state.data
    );
    console.log(recommendatedProductList);

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
                                            <Card className="w-100">
                                                <div className="coffee_img">
                                                    <img src={`http://localhost:3000/mock/images/product/${item.productCode}.jpg`} alt="#" />
                                                </div>
                                                <Card.Body className="coffee_box d-flex flex-column flex-grow-1">
                                                    <Card.Title className="types_text">
                                                        {item.productName}
                                                    </Card.Title>
                                                    <Card.Text className="looking_text flex-grow-1">
                                                        {item.productComments}
                                                    </Card.Text>
                                                    <div className="types_text">
                                                        {item.price.toLocaleString()}
                                                    </div>
                                                </Card.Body>
                                            </Card>
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
