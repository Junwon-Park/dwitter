import express from 'express';
import { body } from 'express-validator';
import * as tweetRepository from '../controller/tweet.js';
// 데이터를 사용하기 위해 모듈에서 export한 모든 메서드를 tweetRepository라는 이름으로 가져온다.
import { validate } from '../middleware/validator.js';
// 에러를 처리하는 로직의 재사용성을 위해 모듈화 했다.
import { checkToken } from '../middleware/auth.js';
// Tweet 관련 요청의 토큰을 검사하기 위해 만든 미들웨어

const router = express.Router();

const validateTweet = [
  // POST와 PUT에 공통적으로 사용되고 또 재사용의 여지가 있기 때문에 재사용할 수 있도록 변수로 선언해 놓았다.
  // 이 것도 각 메서드 마다 다른 API를 사용해야 하는 경우가 많기 때문에 valdate 함수 처럼 모듈화 해서 사용하면 좋을 것 같다.
  body('text')
    .trim()
    .isLength({ min: 3 })
    .withMessage('text should be at least 3 characters'),
  validate
];

// /tweets로 들어오는 Tweet 관련 요청은 로그인을 해야만 권한이 주어지므로 토큰 인증이 되어야 원하는 응답을 받을 수 있도록 한다.
// 토큰을 인증하기 위해 생성한 미들웨어를 라우터의 두 번째 인자(Mount Path 다음)로 넣어서 가장 먼저 실행되도록 한다.
// GET /tweets
// GET /tweets?userId=userId
router.get('/', checkToken, tweetRepository.getAll);
// 여기에서 메서드에 연결만 하는 것이고 호출하면 안된다.
// getTweet()이렇게 하면 호출하는 것이다.
// 호출하게 되면 그 메서드에 연결되는 것이 아니라 그 메서드의 결과 값에 연결되는 것이다.
// 결과 값이 아니라 메서드에 연결해야하기 때문에 호출하지 않고 메서드에 연결만 한 것이다.
// 아래도 모두 마찬가지 이다.

// GET /tweets/:id
router.get('/:id', checkToken, tweetRepository.getId);

// POST /tweets
router.post('/', checkToken, validateTweet, tweetRepository.create);

// PUT /tweets/:id
router.put('/:id', checkToken, validateTweet, tweetRepository.update);

// DELETE /tweets/:id
router.delete('/:id', checkToken, tweetRepository.remove);

// MVC 패턴으로 리팩토링을 통해 데이터를 model로 이동시키고 처리 로직을 controller로 이동시켜
// 여기에서는 router의 본래의 역할인 라우팅만 담당하면 되기 때문에 코드가 간결해지고 유지보수성이 좋아졌다.
// 이런식으로 각각 기능을 모듈화하여 각 모듈에서는 각자의 기능만 하도록 하는 것이 좋다.

export default router;
// 등록한 식별자로 시작하는 것을 노출시킨다.
// router로 시작하는 것을 노출
