import React from "react";
import { Col, Container, Row } from "react-bootstrap";

export default function Main() {
    return (
        <div className="coffee_section layout_padding">
            <Container>
                <Row>
                    <Col className="md-12">
                        <h1 className="coffee_taital">추천상품</h1>
                    </Col>
                </Row>
            </Container>
            <div className="coffee_section_2"></div>
        </div>
    );
}
