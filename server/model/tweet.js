// 원래 데이터는 데이터베이스를 사용해서 제공되는 API를 사용하여 데이터를 CRUD하지만
// 지금은 데이터베이스를 연동하지 않았기 때문에 비슷하게 동작하도록 모듈을 생성했다.
// 데이터베이스를 연동하면 다시 그에 맞게 리팩토링 해야 한다.
import * as authRepository from '../model/auth.js';

let tweets = [
  // POST에서 수정해야 하므로 let을 사용해야 한다.
  {
    id: '1',
    text: 'Fire flower coding!!',
    createdAt: new Date().toString(),
    userId: 1
  },
  {
    id: '2',
    text: 'nono bob!',
    createdAt: new Date().toString(),
    userId: 2
  }
];

//! async가 붙은 함수는 리턴하는 모든 것이 Promise이다.
//! 그렇기 때문에 이 함수들을 사용하는 controller에서는 해당 함수를 then 체이닝 또는 async/await으로 처리해야 한다.
export const getAll = () => {
  return Promise.all(
    // findUser로 데이터를 가져오기 위해 map API에 async/await을 사용해야 한다.
    // async 함수에서 리턴하는 값은 Promise이기 때문에 이 map의 배열은 Promise 배열이다.
    // 그렇기 때문에 이 배열 자체를 Promise.all로 묶어서 return하는 것이다.
    tweets.map(async (tweet) => {
      try {
        const { userId, userName, picture } = await authRepository.findById(
          tweet.userId
        );

        return { ...tweet, userId, userName, picture };
      } catch (err) {
        console.error('Error!!!', err);
      }
    })
  );
};

export const getByUserId = (userId) => {
  return getAll().then((usersTweets) => {
    usersTweets.filter((tweet) => {
      return tweet.userId === userId;
    });
  });
};

export const getId = (tweetId) => {
  return getAll().then((usersTweets) => {
    const findTweets = usersTweets.find((tweet) => {
      // filter를 사용하면 배열이기 때문에 아래에서 데이터 처리할 때 불편하다.
      // find로 찾으면 배열이 아니라 해당 요소를 반환하기 때문에 해당 요소의 데이터를 바로 처리할 때 더 편리하다.
      return tweet.id === tweetId;
    });
    return findTweets;
  });
};

export const create = (text, userName, userId) => {
  const tweet = {
    id: Date.now().toString(), // DB 연동 전 임시
    text,
    createdAt: Date.now().toString(),
    name: userName,
    userId
  };
  tweets = [tweet, ...tweets];
  return tweet;
};

export const update = async (tweetId, textData) => {
  const tweet = await getId(tweetId);
  if (tweet) tweet.text = textData;
  // 어떤 작업 후에 결과를 변수에 담아서 처리하는 경우 해당 변수에 데이터가 들어 왔는 지 조건문으로 확인하는 것이 좋다.
  return tweet;
};

export const remove = (tweetId) => {
  tweets = tweets.filter((tweet) => {
    return tweetId !== tweet.id;
  });
};
