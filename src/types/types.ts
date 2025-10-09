import {Dispatch, SetStateAction} from "react";

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
  user: IUser | null;
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
  setUser?: Dispatch<SetStateAction<IUser | null>>;
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
  coverPhoto?: string | null;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  friendStatus?: "pending" | "accepted" | "rejected" | null;
  sentRequest?: IFriendRequest | null;
  receivedRequest?: IFriendRequest | null;
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

export type UpdateData = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export interface ISearchResponse {
  users: IUser[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginationDemoProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface IFriendRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: "pending" | "accepted" | "rejected";
  friendStatus: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: number;
    firstName: string;
    lastName: string;
    coverPhoto?: string | null;
  } | null;
}

export interface IUserShort {
  id: number;
  firstName: string;
  lastName: string;
  coverPhoto: string | null;
}

export interface IMessage {
  id: number;
  text: string;
  isMe: boolean;
  sender?: IUserShort;
}

export interface IFormInput {
  message: string;
}

export interface IMessageFromAPI {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  sender?: IUserShort
}