enum ResponseCode {
  //  200 OK: 정상 처리
  SUCCESS = "SU",

  // 400 Bad Request: 잘못된 요청 (유효성 등)
  VALIDATION_ERROR = "VE", // 필수 파라미터 누락, 형식 오류 등
  DUPLICATE_RESOURCE = "DR", // 아이디 중복, 이메일 중복 등
  RESOURCE_NOT_FOUND = "RNF", // 존재하지 않는 ID 등

  // 401 Unauthorized: 인증 실패 (로그인 필요)
  UNAUTHORIZED = "UA", // 토큰 없음, 로그인 필요

  // 403 Forbidden: 인가 실패 (접근 권한 부족)
  FORBIDDEN = "FB", // 관리자 전용 접근 등

  // 404 Not Found: 요청한 API 경로 자체가 없음
  ENDPOINT_NOT_FOUND = "ENF", // 라우팅 잘못됨

  // 409 Conflict: 상태 충돌
  CONFLICT = "CF", // 동시에 수정 중이거나 상태 불일치

  // 500 Internal Server Error: 서버 내부 오류
  INTERNAL_SERVER_ERROR = "ISE", // 예기치 못한 예외
  DATABASE_ERROR = "DBE", // DB 접속, 쿼리 오류
}

export default ResponseCode;
