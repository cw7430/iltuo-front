import { ResponseCode } from "../../typs/enum";

const ResponseHttpStatus: Record<ResponseCode, number> = {
  [ResponseCode.SUCCESS]: 200,
  [ResponseCode.VALIDATION_ERROR]: 400,
  [ResponseCode.DUPLICATE_RESOURCE]: 400,
  [ResponseCode.RESOURCE_NOT_FOUND]: 400,
  [ResponseCode.UNAUTHORIZED]: 401,
  [ResponseCode.FORBIDDEN]: 403,
  [ResponseCode.ENDPOINT_NOT_FOUND]: 404,
  [ResponseCode.CONFLICT]: 409,
  [ResponseCode.INTERNAL_SERVER_ERROR]: 500,
  [ResponseCode.DATABASE_ERROR]: 500,
};

export default ResponseHttpStatus;
