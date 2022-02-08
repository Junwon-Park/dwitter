import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as authRepository from '../model/auth.js';

const secret =
  '54FA0AC6FB7BA4B0EC2DC9FC8F7D5C553C5C3BE6F964E3F6DD49795ADDA51010';
// mcdonald를 SHA-256으로 해싱한 값이다.
const bcryptRound = 10;
const expiresInDays = '7d';

const createToken = (data, secret, options) => {
  // 토큰 생성은 여러 메서드에서 동일하게 작성해야 하기 때문에 재사용성이 좋게 함수로 정의한다.
  const token = jwt.sign({ data }, secret, {
    expiresIn: options
  });
  return token;
};

// sign up
export const checkUserInfo = async (req, res) => {
  const { userId, password, userName, email, picture } = req.body;
  const user = await authRepository.findUser(userId);

  // 유저 정보 존재 여부 확인
  if (user) res.status(409).json({ message: `${userId} is already exist` });
  else {
    // 사용자 비밀번호 hashing
    bcrypt.hash(password, bcryptRound, async function (err, hash) {
      if (err) console.error('Bcrypt hash error!', err);
      else {
        await authRepository.saveUser(userId, hash, userName, email, picture);
        // 유저 정보 저장
        try {
          // await은 비동기로 동작하기 때문에 try/catch로 에러 핸들링
          // 토큰 생성 및 응답
          const token = await createToken(userId, secret, expiresInDays);
          console.log(token);
          res.status(201).json({ token, userName, picture });
        } catch (err) {
          console.error(err);
        }
      }
    });
  }
};
// 회원가입 요청이 들어오면 컨트롤러에서 DB에 해당 유저가 존재하는 지 확인한다.
// 존재하지 않는 경우 bcrypt로 비밀번호를 hashing한 후 사용자의 데이터를 DB에 저장하고
// 사용자의 userId를 사용하여 토큰을 생성한 뒤,API에 맞게 응답을 보내고
// 존재한다면 사용자가 이미 존재한다는 메세지를 보낸다.

// login
export const checkLogin = (req, res) => {
  const { userId, password } = req.body;
  const user = authRepository.findUser(userId);

  if (!user)
    res.status(401).json({ message: 'userId or Password is not found' });
  else {
    bcrypt.compare(password, user.password, async function (err, result) {
      if (err) console.error('Bcrypt compare error!', err);
      else {
        if (!result)
          res.status(401).json({ message: 'userId or Password is not found' });
        else {
          const token = await createToken(userId, secret, expiresInDays);
          const { userName, picture } = user;
          res.json({ token, userName, picture });
        }
      }
    });
  }
};
// 로그인 요청이 들어오면 사용자의 userId를 DB를 조회해서 일치하는 유저가 있다면
// 해당 유저의 해싱된 비밀번호와 사용자가 입력한(req.body) 비밀번호를 bcrypt.compare 해서
// 일치하는 지 검증한다. 일치한다면 userId로 토큰을 생성해서 API에 맞게 응답을 보내고
// 일치하지 않는다면 404 에러와 메세지를 보낸다.
// 둘 중 무엇이 일치하지 않은 지는 보안상 정확히 말해주지 않는다.
