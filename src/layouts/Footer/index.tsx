import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="footer_section layout_padding">
      <Container>
        <Row>
          <Col className="md-12">
            <div className="location_text">
              <ul>
                <li>
                  <i aria-hidden="true">일투오커피 대표이사 : 최사장</i>
                </li>
              </ul>
              <ul>
                <li>
                  <i aria-hidden="true">사업자등록번호 : 111-22-333333</i>
                </li>
              </ul>
              <ul>
                <li>
                  <i aria-hidden="true">
                    사업장주소 : 경기도 수원시 영통구 도청로89번길 30, 이루리타워 501호 (이의동)
                  </i>
                </li>
              </ul>
            </div>
            <div className="location_text">
              <ul>
                <li>
                  <Link to="/">
                    {" "}
                    <i className="fa fa-phone" aria-hidden="true"></i>
                    <span className="padding_left_10">+01 1234567890</span>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    {" "}
                    <i className="fa fa-envelope" aria-hidden="true"></i>
                    <span className="padding_left_10">demo@gmail.com</span>
                  </Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
