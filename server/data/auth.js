import { db } from '../db/database.js';

export async function findByUsername(username) {
  return db
    .execute('SELECT * FROM users WHERE username = ?', [username])
    .then((result) => {
      return result[0][0];
      // 이차원 배열의 형태로 반환되며 그 내부에는 db에 저장된 해당 user 객체가 존재한다.
      /* SELECT FROM 쿼리의 결과
      [
        [
          {
            id: 1,
            username: 'aaa1126',
            password: '$2b$10$6ViF2XJbr2XWXcjqA5LIMORX7hHfZjVO/Z7KEo1xQeXxT70bMG0C2',
            name: 'Davids',
            email: 'akd2022@gmail.com',
            url: ''
          }
        ],
      [
     */
    });
}

export async function findById(id) {
  // 인증된 사용자인지 확인하는 controller의 auth.js의 me 메서드에서 사용되는 메서드이다.
  // router의 isAuth에서 찾고자 하는 user의 id를 인자로 전달받아 해당 id와 일치하는 user를 db에서 찾아서 반환한다.
  return db
    .execute('SELECT * FROM users WHERE id = ?', [id]) //
    .then((result) => {
      console.log(result);
      return result[0][0];
      // 위와 동일하게 이차원 배열의 형태로 반환되며 그 내부에는 db에 저장된 해당 user 객체가 존재한다.
    });
}

export async function createUser(user) {
  // controller의 auth.js에서 signup 메서드에 사용되는 db 메서드
  // 인자로 새로 생성할 user의 데이터를 객체 형태로 받는다.
  // db에 생성된 user의 id를 반환한다.
  const { username, password, name, email, url } = user;
  return db
    .execute(
      'INSERT INTO users (username, password, name, email, url) VALUES (?,?,?,?,?)',
      [username, password, name, email, url] // 물음표(?)에 작성된 순서대로 대입된다.
    )
    .then((result) => {
      console.log(result);
      return result[0].insertId;
      // 쿼리 실행 결과는 배열에 객체가 저장된 형태이고
      // db에 저장된 해당 user의 PK가 객체의 insertId로 반환된다.
      /* INSERT INTO 쿼리의 결과
      [
        ResultSetHeader {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 2,
          info: '',
          serverStatus: 2,
          warningStatus: 0
        },
        undefined
      ]
       */
    });
}

// 기존에 메모리를 사용하던 것을 DB를 사용하도록 리팩토링 했지만 다른 곳은 건드리지 않고 오직 data(Model)만을 수정하여 DB를 적용했다.
//! MVC로 각 기능을 나누어 놨기 때문에 DB와 관련된 일을 처리하는 Model 부분만 수정하면 된다.
