import { validationResult } from 'express-validator';
// validate 함수에서 유효성 검사의 결과를 받아야 하기 때문에 validationResult만 받아온다.

export const validate = (req, res, next) => {
  // 미들웨가 구현된 모든 위치에 동일한 이 로직을 모두 작성하는 것은 비효율적이다.
  // 그렇기 때문에 따로 함수로 구현해 놓고 재사용하기 편리하도록 했다.
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array() });
  // 에러 메세지를 배열 형식으로 응답한다.
};
