import { CartOption } from "../../../../typs/interface/order";
import { Cart } from "../../../../typs/interface/order";
import { OptionDetail } from "../../../../typs/interface/product";
import { Option } from "../../../../typs/interface/product";

type CartOmit = "cartId" | "productId" | "quantity" | "cartDate";

type OptionDetailOmit = "optionDetailId" | "valid";

type OptionOmit = "optionId" | "majorCategoryId" | "valid";

type OmitedCart = Omit<Cart, CartOmit>;

type OmitedOptionDetail = Omit<OptionDetail, OptionDetailOmit>;

type OmitedOption = Omit<Option, OptionOmit>;

type CartOptionResponseDto = CartOption & OmitedCart & OmitedOptionDetail & OmitedOption;

export default CartOptionResponseDto;
