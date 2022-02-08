import jwt from 'jsonwebtoken';
import * as authRepository from '../model/auth.js';

const secret =
  '54FA0AC6FB7BA4B0EC2DC9FC8F7D5C553C5C3BE6F964E3F6DD49795ADDA51010';
// mcdonald를 SHA-256으로 해싱한 값이다.

const encodeToken = async (token, secret) => {
  try {
    const encoded = await jwt.verify(token, secret);
    return encoded;
  } catch (err) {
    console.error('Token encoding error!', err);
  }
};

// check token
// 토큰의 유효성을 확인해서 로그인된 유저인 지 확인하는 함수를 미들웨어 파트로 분리했다.
// 컨트롤러에 있어도 문제 없지만 앱이 실행될 때마다 실행되는 부분이기 때문에 미들웨어로 빼는 것이 맞는 것 같다.
export const checkToken = async (req, res) => {
  const authorization = req.get('Authorization');
  // get 메소드를 사용하면 요청 메세지의 해당 필드의 값을 가져온다.
  if (!(authorization && authorization.startsWith('Bearer ')))
    // 토큰을 전달할 때에는 Type을 함께 명시해줘야 한다. (type token) 형식
    // token의 타입은 Bearer로 전달해야 한다.
    // https://developer.mozilla.org/ko/docs/Web/HTTP/Authentication#authorization%EC%99%80_proxy-authorization_%ED%97%A4%EB%8D%94
    // 해당 문자열로 시작하는 지 확인하는 문자열 메서드 startsWith로 'Bearer '로 시작하는 지 검사
    // 'Bearer '로 시작하지 않는다면 올바른 형식이 아니기 때문에 에러 발생
    return res.status(401).json({ meassage: 'Authentication error' });

  const token = authorization.split(' ')[1];
  const encoded = await encodeToken(token, secret);
  console.log(encoded);
  const user = await authRepository.findUser(encoded.data);
  console.log(user);

  if (!user) res.status(401).json({ meassage: 'Authentication error' });
  else res.json({ token, userName: user.userName });
};
// 토큰을 verify 메서드로 복호화 해서 DB에 일치하는 userId가 있는 지 확인한 뒤,
// 있다면 API에 맞게 응답을 보내고 없다면 에러 메세지를 보낸다.
