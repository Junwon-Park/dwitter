import mysql from 'mysql2'; // 설치한 MySQL을 불러온다.
import { config } from '../config.js'; // Pool을 생성하기 위한 MySQL 정보를 환경 변수로 작성하기 위해 config를 불러온다.
import SQ from 'sequelize'; // Sequelize 라이브러리를 불러온다.

const { host, user, database, password } = config.db; // DB의 정보를 더 간편하게 사용하기 위해 구조 분해 할당을 사용한다.
export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  dialect: 'mysql' // Default 값이 mysql이기 때문에 생략 가능하지만 명시적으로 하기 위해 적었다.
});
// 첫 번째 인자로 DB에 접속할 때, 필요한 정보를 받고, 두 번째 인자로 실행할 DB의 옵션을 지정할 수 있다.
// 여기에서는 우리가 지정한 host와 사용할 RDBMS로 mysql을 옵션으로 지정했다.
// 이렇게 생성된 sequelize 객체로 app.js에서 DB를 연동한다.

const pool = mysql.createPool({
  // createPool을 사용해서 Pool을 생성한다.
  // 아래 작성한 MySQL 정보 객체를 넘기면 해당 MySQL Pool이 생성된다.
  // 이렇게 생성한 Pool로 MySQL을 실행할 수 있다.
  host: config.db.host,
  user: config.db.user,
  database: config.db.database,
  password: config.db.password
});

export const db = pool.promise();
// 앱에서는 비동기적으로 동작하는 DB를 사용할 것이므로 위에서 생성한 Pool을 직접 export하지 않고,
// pool.promise()를 db라는 변수에 할당해서 비동기적으로 동작하는 DB Pool을 export 한다.
// export한 promise 타입의 pool을 할당한 db는 app.js에서 서버가 실행(app.listen)되기 전에 연결한다.
// 그리고 Model에서 db를 다루기 위해 이 모듈을 불러서 사용한다.
