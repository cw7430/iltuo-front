import { Product } from "../../../../typs/interface/product";

export default interface ProductResponseDto extends Product {
    majorCategoryId: number;
    isDiscounted: boolean;
    hasOption: boolean;
    discountedPrice: number;
}
