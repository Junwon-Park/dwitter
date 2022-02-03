import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import tweetsRouter from './router/tweets.js'; // .js 확장자 까지 정확히 적어야 한다.

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(helmet());
app.use(express.json()); // 이 앱에서 req의 body를 보려면 express.json을 미들웨어에 등록해야 한다.

app.use('/tweets', tweetsRouter); // tweet관련 처리를 하는 모듈로 라우팅

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

app.listen(8080);
