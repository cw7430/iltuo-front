import { OptionDetail } from "../../../../typs/interface/product";

export default interface OptionDetailResponseDto extends OptionDetail {
    majorCategoryId: number;
    priorityIndex: number;
    optionTypeCode: string;
}