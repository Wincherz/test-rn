const USERS_ULR = 'https://gorest.co.in/public-api/users?_format=json&access-token=Xbasbm1ajZLFd-zpie-fcIh1qBe7B4-v3faO';

export const getUsersFromServer = () => {
  return fetch(USERS_ULR).then(data => data.json());
}