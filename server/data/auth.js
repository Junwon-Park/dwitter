import SQ from 'sequelize';
import { sequelize } from '../db/database.js';

const DataTypes = SQ.DataTypes;
// SQ(sequelize 라이브러리)의 DataTypes는 Model의 스키마의 각 컬럼의 타입을 정의할 때, 사용하는 객체이다.

export const User = sequelize.define(
  // User라는 Model을 정의한다.
  // 첫 번째 인자로 Table의 이름,
  // 두 번째 인자로 Table의 스키마,
  // 세 번쨰 인자는 Table의 옵션을 정의할 수 있으며, 이 것은 Optional(선택 사항)이다.
  // data/tweet.js에서 Tweet과 관계를 설정하기 위해 불러와야 하므로 export 해줘야 한다.
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false, // allowNull의 기본 값은 true이다.
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    url: DataTypes.TEXT
  },
  { timestamps: false } // 생성되는 Table에 updatedAt, createdAt 자동 생성 off(기본 값은 true)
);

export async function findByUsername(username) {
  return User.findOne({ where: { username } }); // { where: { username: username } }
  // DB에서 찾고자 하는 데이터가 존재하는 Table을 생성한 Model을 사용해서 데이터를 CRUD할 수 있다.
  // User 테이블의 username 컬럼의 값이 인자로 받은 username인 데이터를 하나 가져온다.
}

export async function findById(id) {
  return User.findByPk(id);
  // findByPk() 메서드는 인자를 객체가 아닌 원시 값으로 넘겨준다.
  // 왜냐하면 이미 메서드 자체가 동일한 PK를 가진 데이터를 가져오는 것이기 때문에 where를 작성할 필요가 없다.
}

export async function createUser(user) {
  return User.create(user).then((data) => {
    console.log(data);
    return data;
  });
}

// 기존에 메모리를 사용하던 것을 DB를 사용하도록 리팩토링 했지만 다른 곳은 건드리지 않고 오직 data(Model)만을 수정하여 DB를 적용했다.
//! MVC로 각 기능을 나누어 놨기 때문에 DB와 관련된 일을 처리하는 Model 부분만 수정하면 된다.
