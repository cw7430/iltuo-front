import { OptionDetail } from "../../../../typs/interface/product";

export default interface OptionDetailResponseDto extends OptionDetail {
    majorCategoryId: number;
    optionTypeCode: string;
}