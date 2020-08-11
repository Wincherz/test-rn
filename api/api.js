const USERS_ULR = 'https://gorest.co.in/public-api/users?_format=json&access-token=gwQEUWfFtsLnKNtotitr_un3_qhuHhSrhe-A';

export const getUsersFromServer = () => {
  return fetch(USERS_ULR).then(data => data.json());
}