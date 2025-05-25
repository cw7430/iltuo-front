import { Cart } from "../../../../typs/interface/order";
import { Product } from "../../../../typs/interface/product";

type CartOmit = "cartDate";

type ProductOmit =
    | "productCode"
    | "minerCategoryId"
    | "productComments"
    | "discountedRate"
    | "recommended"
    | "registerDate"
    | "valid";

type OmitedCart = Omit<Cart, CartOmit>;

type OmitedProduct = Omit<Product, ProductOmit>;

type CartListResponseDto = OmitedCart & OmitedProduct;

export default CartListResponseDto;
