import React from "react";
import { ProductView } from "../../../typs/interface/product";
import { Card } from "react-bootstrap";

interface Props {
    productView: ProductView;
    isMainPage: boolean;
}

export default function ProductCard({ productView, isMainPage }: Props) {
    const { productCode, productName, productComments, price } = productView;
    return (
        <Card className="w-100">
            <div className="coffee_img">
                <img
                    src={`http://localhost:3000/mock/images/product/${productCode}.jpg`}
                    alt="#"
                />
            </div>
            <Card.Body className="coffee_box d-flex flex-column flex-grow-1">
                <Card.Title className="types_text">{productName}</Card.Title>
                <Card.Text className="looking_text flex-grow-1">
                    {isMainPage ? productComments || "\u00A0" : productComments}
                </Card.Text>
                <div className="types_text">{price.toLocaleString()}</div>
            </Card.Body>
        </Card>
    );
}
