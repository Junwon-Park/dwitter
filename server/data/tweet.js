import { db } from '../db/database.js';

const USERS_TWEETS_JOIN =
  'SELECT tw.id, tw.text, tw.createdAt, tw.userId, us.username, us.name, us.url FROM tweets as tw JOIN users as us ON tw.userId = us.id';
const ORDER_BY_TW = 'ORDER BY tw.createdAt DESC';
// 반복적으로 사용되는 긴 쿼리는 재사용성을 위해 변수로 선언해서 사용한다.

export async function getAll() {
  // 모든 트윗을 반환하는 메서드이다.
  return db
    .execute(`${USERS_TWEETS_JOIN} ${ORDER_BY_TW}`) //
    .then((result) => result[0]);
  // SELECT FROM 쿼리에 대한 결과이기 때문에 이차원 배열의 형태의 결과가 반환되고,
  // 모든 트윗을 배열의 형태로 반환해야 하기 때문에 result[0]을 반환한다.
}

export async function getAllByUsername(username) {
  // 인자로 받은 username과 일치하는 트윗을 모두 반환하는 메서드이다.
  return db
    .execute(`${USERS_TWEETS_JOIN} WHERE username=?`, [username])
    .then((result) => result[0]);
  // SELECT FROM 쿼리의 결과는 이차원 배열의 형태이고, 배열의 형태로 반환해야 하기 때문에 result[0]을 반환한다.
  // 해당 user가 작성한 트윗이 여러 개일 수 있기 때문에 배열의 형태로 반환해야 한다.
}

export async function getById(id) {
  // 인자로 받은 id와 일치하는 id의 tweet을 반환하는 메서드이다.
  return db
    .execute(`${USERS_TWEETS_JOIN} WHERE tw.id = ?`, [id]) //
    .then((result) => result[0][0]);
  // SELECT FROM 쿼리의 결과이기 때문에 이차원 배열이고 id와 일치하는 트윗은 하나 뿐(트윗의 id는 고유한 값)이기 때문에
  // 해당 트윗(result[0][0])많을 반환한다.
}

export async function create(text, userId) {
  // 인자로 text와 user의 id를 받아 DB에 트윗을 생성하고 해당 트윗 객체를 반환하는 메서드이다.
  return db
    .execute('INSERT INTO tweets(text, createdAt, userId) VALUES(?,?,?)', [
      text,
      new Date(), // 날짜도 작접 넣어줘야 한다.
      userId
    ]) // 물음표에 대입 순서 중요
    .then((result) => getById(result[0].insertId));
  // INSERT INTO 쿼리의 결과로 배열을 반환받고 배열에는 생성된 트윗의 정보가 담긴 객체가 존재한다.
  // 생성된 트윗의 id는 해당 객체의 insertId로 접근할 수 있다.
}

export async function update(id, text) {
  // 트윗을 수정하고 수정된 트윗 객체를 반환하는 메서드이다.
  return db
    .execute('UPDATE tweets SET text=? WHERE id=?', [text, id])
    .then(() => getById(id)); // 업데이트한 트윗의 id를 getById에 넣어서 해당 트윗 객체를 반환하도록 한다.
}

export async function remove(id) {
  // 인자로 받은 id와 동일한 id를 가진 트윗을 DB에서 삭제하는 메서드
  return db.execute('DELETE FROM tweets WHERE id=?', [id]);
  // 트윗을 삭제하고 특별히 반환해야 할 것은 없다.
}

// 위 모든 메서드는 .then을 반환하기 때문에 Promise를 반환하는 것과 같다.
//! 그렇기 때문에 위 메서드를 호출하는 곳에서는 await으로 반환 값을 받는다.
