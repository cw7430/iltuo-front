import { ResponseCode } from "../../typs/enum";

const ResponseMessage: Record<ResponseCode, string> = {
    [ResponseCode.SUCCESS]: "요청이 성공적으로 처리되었습니다.",
    [ResponseCode.VALIDATION_ERROR]: "입력값이 잘못되었습니다.",
    [ResponseCode.DUPLICATE_RESOURCE]: "이미 존재하는 항목입니다.",
    [ResponseCode.RESOURCE_NOT_FOUND]: "요청한 자원을 찾을 수 없습니다.",
    [ResponseCode.UNAUTHORIZED]: "로그인이 필요합니다.",
    [ResponseCode.FORBIDDEN]: "접근 권한이 없습니다.",
    [ResponseCode.ENDPOINT_NOT_FOUND]: "요청한 경로가 잘못되었습니다.",
    [ResponseCode.CONFLICT]: "요청이 현재 상태와 충돌합니다.",
    [ResponseCode.INTERNAL_SERVER_ERROR]: "서버에서 문제가 발생했습니다.",
    [ResponseCode.DATABASE_ERROR]: "데이터베이스 처리 중 오류가 발생했습니다.",
};

export default ResponseMessage;
