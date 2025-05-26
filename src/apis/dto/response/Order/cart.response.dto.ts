import { Cart } from "../../../../typs/interface/order";
import { Product } from "../../../../typs/interface/product";

type CartOmit = "cartDate";

type ProductOmit =
    | "minerCategoryId"
    | "productComments"
    | "discountedRate"
    | "recommended"
    | "registerDate"
    | "valid";

type OmitedCart = Omit<Cart, CartOmit>;

type OmitedProduct = Omit<Product, ProductOmit>;

type CartResponseDto = OmitedCart & OmitedProduct;

export default CartResponseDto;
