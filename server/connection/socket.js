import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

class Socket {
  // 서버의 Socket이 될 클래스이다.
  // initSocket 메서드에서 서버 실행 시, 이 클래스의 인스턴스를 생성한다.
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: '*'
      }
      // 모든 클라이언트의 출처에 대해 서용하는 CORS 옵션을 추가한다.
    });

    this.io.use((socket, next) => {
      // io.use 미들웨어 함수는 들어오는 모든 연결에 대해 실행하는 함수이다.
      // 모든 socket 연결에 대해 미들웨어가 실행된다.
      // 이 미들웨어는 연결된 socket(client)의 토큰을 인증하는 미들웨어이다.
      // 토큰을 인증하는 이유는 이 서비스에서 소켓을 사용하는 기능은 트윗 기능이고
      // 트윗 기능을 사용하려면 로그인이 된, 즉 인증된 사용자여야 하기 때문에
      // socket에 연결된 사용자는 인증된 사용자이며 토큰을 가지고 있어야 한다.
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error!'));
      }
      jwt.verify(token, config.jwt.secretKey, (error, decoded) => {
        if (error) {
          return next(new Error('Authentication error'));
        }
        next();
      });
    });
    // 위 미들웨어에서 에러가 발생하지 않고 마지막에 next()를 만나야 아래 'connection' 이벤트로 넘어간다.

    this.io.on('connection', (socket) => {
      console.log('Socket client connected');
    });
    // 이 리스너를 만난 Socket(Client)은 서버의 Socket과
    // 연결이 끊길 때까지('disconnect' 이벤트) 연결이 유지된다.
    // 연결된 Socket은 Broadcasting을 들을 수 있다.
  }
}

// 서버가 실행되면 initSocket 메서드가 호출되면서 서버의 Socket이 생성된다.
// 그렇게 생성된 서버의 Socket은 getSocketIO() 메서드로 접근할 수 있다.
let socket;
export function initSocket(server) {
  // 서버의 Socket을 생성하는 메서드
  if (!socket) {
    socket = new Socket(server);
  }
}
export function getSocketIO() {
  // 서버의 Socket을 다룰 수 있는 메서드
  if (!socket) {
    throw new Error('Please call init first');
  }
  return socket.io;
}
