import { Product } from "../../../../typs/interface/product";

export default interface ProductResponseDto extends Product {
  majorCategoryId: number;
  optionCount: number;
  discountedPrice: number;
}
