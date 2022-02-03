import express from 'express';

const router = express.Router();

let tweets = [
  // POST에서 수정해야 하므로 let을 사용해야 한다.
  {
    id: '1',
    text: 'Fire flower coding!!',
    createdAt: Date.now().toString(),
    name: 'Bob',
    userId: 'bob'
  },
  {
    id: '2',
    text: 'nono bob!',
    createdAt: Date.now().toString(),
    name: 'kevin',
    userId: 'bob'
  }
];

// GET /tweets
// GET /tweets?userId=userId
router.get('/', (req, res, next) => {
  const userId = req.query.userId;
  const tweetDatas = userId
    ? tweets.filter((tweet) => {
        return tweet.userId === userId;
      })
    : tweets;
  // req.query.userId가 존재하면 filter 한 데이터 배열 tweetDatas에 할당
  // userId가 없으면 트윗 전체 목록 tweets 할당
  res.json(tweetDatas);
});

// GET /tweets/:id
router.get('/:id', (req, res, next) => {
  console.log(req.params.id);
  const tweetId = req.params.id;
  const findTweet = tweets.find((tweet) => {
    // filter를 사용하면 배열이기 때문에 아래에서 데이터 처리할 때 불편하다.
    // find로 찾으면 배열이 아니라 해당 요소를 반환하기 때문에 해당 요소의 데이터를 바로 처리할 때 더 편리하다.

    return tweet.id === tweetId;
  });

  if (findTweet) {
    res.json(findTweet);
  } else {
    res.status(404).json({ message: `Tweet id(${tweetId}) not found` });
  }
});

// POST /tweets
router.post('/', (req, res, next) => {
  console.log(req.body);
  const { text, userName, userId } = req.body;
  const tweet = {
    id: Date.now().toString(), // DB 연동 전 임시
    text,
    createdAt: Date.now().toString(),
    name: userName,
    userId
  };
  tweets = [tweet, ...tweets];
  res.status(201).json(tweet);
});

// PUT /tweets/:id
router.put('/:id', (req, res, next) => {
  console.log(req.params.id);
  const tweetId = req.params.id;
  const textData = req.body.text;

  const findTweet = tweets.find((tweet) => {
    // filter를 사용하면 배열이기 때문에 아래에서 데이터 처리할 때 불편하다.
    // find로 찾으면 배열이 아니라 해당 요소를 반환하기 때문에 해당 요소의 데이터를 바로 처리할 때 더 편리하다.
    return tweet.id === tweetId;
  });

  if (findTweet) {
    findTweet.text = textData;
    console.log(findTweet.text);

    res.json(findTweet);
  } else {
    res.status(404).json({ message: `Tweet id(${tweetId}) not found` });
  }
});

// DELETE /tweets/:id
router.delete('/:id', (req, res, next) => {
  const tweetId = req.params.id;
  const findTweet = tweets.filter((tweet) => {
    return tweetId !== tweet.id;
  });
  console.log(findTweet);
  res.sendStatus(204); // 삭제는 데이터를 삭제하는 것이기 때문에 삭제가 성공 했는 지 알맞은 상태 코드만 보낸다.
});

export default router;
// 등록한 식별자로 시작하는 것을 노출시킨다.
// router로 시작하는 것을 노출
