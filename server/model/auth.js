let userData = [
  {
    id: 1,
    userId: 'ab2311',
    password: '1234',
    userName: 'lottelia',
    email: 'aekdf12334@gmail.com',
    picture: ''
  },
  {
    id: 2,
    userId: 'abcde11',
    password: '1234',
    userName: 'mcdonald',
    email: 'aedt134@naver.com',
    picture: ''
  },
  {
    id: 3,
    userId: 'aaa1122',
    password: '$2a$10$HWdoRTVBYMtK5B06yXBo5e4mF32K709mzolEh0kPAzwnG128b3Yga',
    userName: 'Dave',
    email: 'akd2022@gmail.com',
    picture: ''
  }
];

export const findById = (id) => {
  const user = userData.find((data) => {
    return id === data.id;
  });
  if (user) return user;
};

export const findUser = (userId) => {
  const user = userData.find((data) => userId === data.userId);

  if (user) return user;
};

export const saveUser = (userId, hash, userName, email, picture) => {
  userData.push({
    id: userData.length + 1,
    userId,
    password: hash,
    userName,
    email,
    picture
  });
  return userData;
};
