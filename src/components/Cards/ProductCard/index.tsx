import { ProductResponseDto } from "../../../apis/dto/response/Products";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { API_PATH, DETAIL_PATH } from "../../../constants/url";

interface Props {
  product: ProductResponseDto;
  isMainPage: boolean;
}

export default function ProductCard({ product, isMainPage }: Props) {
  const { productId, productCode, productName, productComments, discountedPrice } = product;

  return (
    <Card
      className="w-100"
      as={Link}
      to={DETAIL_PATH("product", productId)}
      style={{ cursor: "pointer" }}
    >
      <div className="coffee_img">
        <img src={`${API_PATH}/images/product/${productCode}.jpg`} alt="#" />
      </div>
      <Card.Body className="coffee_box d-flex flex-column flex-grow-1">
        <Card.Title className="types_text">{productName}</Card.Title>
        <Card.Text className="looking_text flex-grow-1">
          {isMainPage ? productComments || "\u00A0" : productComments}
        </Card.Text>
        <div className="types_text">{discountedPrice.toLocaleString()}</div>
      </Card.Body>
    </Card>
  );
}
