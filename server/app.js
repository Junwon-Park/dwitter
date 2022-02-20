import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import tweetsRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import { initSocket } from './connection/socket.js';
import { sequelize } from './db/database.js';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

app.use('/tweets', tweetsRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

sequelize.sync().then(() => {
  // sequelize의 sync() 메서드는 우리가 작성한 Model과 실제 DB의 스키마가 일치하도록(Sync) 해주는 메서드이다.
  const server = app.listen(config.host.port);
  initSocket(server);
});
// 위 처럼 DB가 연결된 다음 바로 Server와 Socket을 연결하기 위해 then() 안에 Server와 Socket을 실행했다.
