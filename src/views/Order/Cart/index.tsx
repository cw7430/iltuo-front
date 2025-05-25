import { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Loader } from "../../../components/Gif";

export default function Cart() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <Container>
                <Row>
                    <Col className="mt-5">
                        <h2 className="mb-4">{"장바구니"}</h2>
                    </Col>
                </Row>
                <Row>
                    <Col lg={8}>
                        <Card>
                            <Card.Header>
                                <h4>{"내 장바구니"}</h4>
                            </Card.Header>
                            <Card.Body></Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4}>
                        <Card>
                            <Card.Header>
                                <h4>{"주문 요약"}</h4>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col className="text-start">
                                        <p>{"총 상품가격: "}</p>
                                    </Col>
                                    <Col className="text-end">
                                        <p>{"총 상품가격"}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="text-start">
                                        <p>{"배송비: "}</p>
                                    </Col>
                                    <Col className="text-end">
                                        <p>{"배송비"}</p>
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col className="text-start">
                                        <h5>{"총 주문금액: "}</h5>
                                    </Col>
                                    <Col className="text-end">
                                        <h5>{"총 주문금액"}</h5>
                                    </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer>
                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="button">
                                        {"주문하기"}
                                    </Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
            {isLoading && <Loader />}
        </>
    );
}
