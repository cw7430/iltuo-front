export default interface Option {
  optionId: number;
  majorCategoryId: number;
  priorityIndex: number;
  optionName: string;
  optionTypeCode: "OPT001 | OPT002";
  valid: boolean;
}
