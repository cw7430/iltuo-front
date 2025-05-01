import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import { MAIN_PATH, LIST_PATH } from "../../constants/url";
import { useMajorCategoryStore } from "../../stores";

export default function Header() {
    const { pathname } = useLocation();

    const majorCategoryList = useMajorCategoryStore((state) => state.data);

    return (
        <div
            className={`header_section ${
                pathname === MAIN_PATH() ? "" : "header_bg"
            }`}
        >
            <Container>
                <Navbar expand="lg">
                    <Navbar.Brand as={Link} to={MAIN_PATH()}>
                        <img
                            src={require("../../assets/images/logo.png")}
                            alt="로고"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link
                                as={Link}
                                to={MAIN_PATH()}
                                active={pathname === MAIN_PATH()}
                            >
                                {"홈"}
                            </Nav.Link>
                             <>
                                {majorCategoryList.map((category) => (
                                    <Nav.Link
                                        key={category.majorCategoryId}
                                        as={Link}
                                        to={LIST_PATH("product",category.majorCategoryId)}
                                        active={pathname === LIST_PATH("product",category.majorCategoryId)}
                                    >
                                        {category.majorCategoryName}
                                    </Nav.Link>
                                ))}
                            </>
                            <Nav.Link href="#">{"주문내역"}</Nav.Link>
                            <Nav.Link href="#">{"장바구니"}</Nav.Link>
                        </Nav>
                        <div className="form-inline my-2 my-lg-0">
                            <div className="login_bt">
                                <Row>
                                    {/* <Col xs={6}>
                                        <button>
                                            <span className="user_icon">
                                                <i
                                                    className="fa fa-user"
                                                    aria-hidden="true"
                                                ></i>
                                            </span>
                                            {"내정보"}
                                        </button>
                                    </Col>
                                    <Col xs={6}>
                                        <button>{"로그아웃"}</button>
                                    </Col> */}
                                    <Col xs={6}>
                                        <button>
                                            <span className="user_icon">
                                                <i
                                                    className="fa fa-user"
                                                    aria-hidden="true"
                                                ></i>
                                            </span>
                                            {"로그인"}
                                        </button>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
            {pathname === MAIN_PATH() && (
                <div className="banner_section layout_padding">
                    <Container>
                        <Row>
                            <Col className="md-12">
                                <div className="banner_taital_main">
                                    <h1 className="banner_taital">
                                        {"Iltuo"} <br />
                                        {"Coffee"}
                                    </h1>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </div>
    );
}
