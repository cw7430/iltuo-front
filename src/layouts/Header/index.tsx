import React, { FC, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import { MAIN_PATH, PLAIN_PATH, LIST_PATH } from "../../constants/url";
import { useAuthStore } from "../../stores";
import { useMajorCategoryStore } from "../../stores";
import { LogInModal } from "../../components/Modals";

interface Props {
    handelLogout: () => void;
}

const Header: FC<Props> = ({handelLogout}) => {
    const { pathname } = useLocation();

    const navigate = useNavigate();

    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    const majorCategoryList = useMajorCategoryStore((state) => state.data);

    const [showLogInModal, setShowLogInModal] = useState<boolean>(false);

    const handleShowLoginModal = () => setShowLogInModal(true);

    const handleCloseLogInModal = () => setShowLogInModal(false);

    const handleNavigateSignUpPage = () => navigate(PLAIN_PATH("sign_up", null));

    return (
        <>
            <div className={`header_section ${pathname === MAIN_PATH() ? "" : "header_bg"}`}>
                <Container>
                    <Navbar expand="lg">
                        <Navbar.Brand as={Link} to={MAIN_PATH()}>
                            <img src={require("../../assets/images/logo.png")} alt="로고" />
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
                                            to={LIST_PATH("product", category.majorCategoryId)}
                                            active={
                                                pathname ===
                                                LIST_PATH("product", category.majorCategoryId)
                                            }
                                        >
                                            {category.majorCategoryName}
                                        </Nav.Link>
                                    ))}
                                </>
                                {isLoggedIn && (
                                    <>
                                        <Nav.Link href="#">{"주문내역"}</Nav.Link>
                                        <Nav.Link href="#">{"장바구니"}</Nav.Link>
                                    </>
                                )}
                            </Nav>
                            <div className="form-inline my-2 my-lg-0">
                                <div className="login_bt">
                                    <Row>
                                        {isLoggedIn && (
                                            <>
                                                <Col xs={6}>
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
                                                    <button onClick={handelLogout}>{"로그아웃"}</button>
                                                </Col>
                                            </>
                                        )}
                                        {!isLoggedIn && (
                                            <>
                                                <Col xs={6}>
                                                    <button onClick={handleShowLoginModal}>
                                                        <span className="user_icon">
                                                            <i
                                                                className="fa fa-user"
                                                                aria-hidden="true"
                                                            ></i>
                                                        </span>
                                                        {"로그인"}
                                                    </button>
                                                </Col>
                                                <Col xs={6}>
                                                    <button onClick={handleNavigateSignUpPage}>
                                                        {"회원가입"}
                                                    </button>
                                                </Col>
                                            </>
                                        )}
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
            <LogInModal
                showLogInModal={showLogInModal}
                handleCloseLogInModal={handleCloseLogInModal}
            />
        </>
    );
}

export default Header;
