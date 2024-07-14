export interface User {
  id: number;
  username: string;
  displayName: string;
  password: string;
}

//Satisfies keyword
// const miAmor = {
//   age: 30,
//   weight: 30,
// } satisfies TestSatisfy;
// miAmor.age.toFixed(2);

export interface UserQueryParam {
  filter: string;
  value: string;
}

export interface UserRequestParams {
  id: string;
}

export interface UserBodyParam {
  username?: string;
  displayName?: string;
  password?: string;
}

export interface CartItem {
  name: string;
  price: number;
}
