import { OptionDetail } from "../../../../typs/interface/product";

export default interface OptionDetailResponseDto extends OptionDetail {
  optionName: string;
  majorCategoryId: number;
  priorityIndex: number;
  optionTypeCode: string;
}
