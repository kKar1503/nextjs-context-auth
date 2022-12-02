export type Role = 'admin' | 'user';

export type LoginParam = {
  username: string;
  password: string;
};

export type User = LoginParam & {
  role: Role;
};

export type UserWithToken = User & {
  token: string;
};

export type Error = { error: string };

export type ErrorCallback = (error: Error) => void;
