export interface IRegistrationResponse {
  message: string;
  success: boolean;
  accessToken: string;
  user: IUser;
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

export interface IPostData {
  title?: string;
  images?: string[];
}

export interface IProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
}

export interface IPostImage {
  id: number;
  postId: number;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  coverPhoto?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPost {
  id: number;
  authorId?: number;
  title: string;
  author?: IUser;
  images?: IPostImage[];
  createdAt?: string;
  updatedAt?: string;
  likes?: any;
}