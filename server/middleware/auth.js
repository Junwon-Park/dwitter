import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import * as userRepository from '../data/auth.js';

const AUTH_ERROR = { message: 'Authentication Error' };
// 반복해서 사용되는 것을 변수로 선언해서 재사용성을 높힌다.
// 그리고 변수로 선언해 놓으면 반복 타이핑 시 자동완성 기능이 지원돼서 편하다.

export const isAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization'); // req의 Authorization 필드의 값 추출
  if (!(authHeader && authHeader.startsWith('Bearer '))) {
    // authHeader에 값이 없고 && authHeader라는 문자열이 'Bearer '로 시작하지 않는다면 true
    // Authorization이라는 헤더에 토큰이 왔는 지, Bearer 형식으로 잘 왔는 지를 검사하는 것이다.
    return res.status(401).json(AUTH_ERROR);
  }
  // 위 if문에 해당하지 않는다면 토큰이 왔고 유효한 형식이므로 아래 로직으로 진행한다.

  const token = authHeader.split(' ')[1]; // 'Bearer hashstring' 형식에서 Bearer 제거(Hash만 추출)
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }
    req.userId = user.id; // req.customData
    // 이 요청(req)에 userId 필드를 추가한다.
    next();
    // router에서 미들웨어로 실행됐으므로 위에서 에러가 발생하지 않았다면 req에 userId 필드를 추가하고 다음 미들웨어로 넘긴다.
  });
};
