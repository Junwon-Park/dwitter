import dotenv from 'dotenv';
dotenv.config();

export const required = (key, defaultValue = undefined) => {
  const value = process.env[key] || defaultValue;
  // process.env[key]에 값이 있다면 그 것을 할당하고, 없다면 defaultValue를 할당하는데
  // defaultValue를 넣지 않았다면 기본 값으로 undefined를 할당한다.
  // defaultValue는 값을 넣지 않으면 지정한 값을 기본 값으로 한다.

  if (value == null) throw new Error(`Key ${key} is undefined`);
  // ==으로 체크하면 value가 null이거나 undefined라면 true이다.
  // value가 null이거나 undefined라면 위 에러를 던진다.

  return value;
};

export const config = {
  jwt: {
    secretKey: required('JWT_SECRET'),
    // defaultValue는 값을 넣지 않아도 된다.
    expiresInDays: required('JWT_EXPIRES_DAY', '1d')
  },
  bcrypt: {
    bcryptRound: parseInt(required('BYCRYPT_SALT_ROUNDS', 12))
    // 반환 값이 숫자여야 하는 경우 만일의 타입 에러를 방지하기 위해 parseInt를 사용해서 숫자 타입으로 변환해준다.
  },
  host: {
    port: parseInt(required('HOST_PORT', 4000))
    // .env의 HOST라는 필드가 정의되지 않았다면 4000을 할당한다.
    // port는 숫자 타입으로 반환해야 하기 때문에 타입 에러를 방지하기 위해 parseInt를 사용한다.
    //! .env에 정의한 모든 필드 값의 타입은 String이다.
  }
};
