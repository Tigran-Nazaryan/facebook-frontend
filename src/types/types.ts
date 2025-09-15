export interface IRegistrationResponse {
  message: string;
  success: boolean;
  accessToken: string;
  user: IUser;
}

export interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  birthday?: string;
  gender?: string;
}

export interface IAuthResponse {
  accessToken: string;
  tokens: string;
  user: IUser;
}

export interface IAuthContextType {
  user: any | null;
  isAuth: boolean;
  login: (email: string, password: string) => Promise<void>;
  registration: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    birthday?: string,
    gender?: string
  ) => Promise<IRegistrationResponse>;
  verifyUser: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  isLoading: boolean;
}