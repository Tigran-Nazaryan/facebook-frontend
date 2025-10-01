import $api from "@/http";
import {IPost, IProfileData} from "@/types/types";

const ProfileService = {
  getAllPosts: async (): Promise<IPost[]> => {
    const res = await $api.get("/posts");
    return res.data;
  },

  createPost: async (data: FormData): Promise<IPost> => {
    const response = await $api.post("/posts", data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePost: async (id: number, data: FormData): Promise<IPost> => {
    const response = await $api.put(`/posts/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deletePost: async (id: number): Promise<void> => {
    const response = await $api.delete(`/posts/${id}`);
    return response.data;
  },

  likePost: async (postId: number) => {
    const response = await $api.post(`/posts/${postId}/like`);
    return response.data;
  },

  unLikePost: async (postId: number) => {
    const response = await $api.delete(`/posts/${postId}/like`);
    return response.data;
  },
  allPostsUser: async () => {
    const response = await $api.get(`/profile/posts`);
    return response.data;
  },
};

export default ProfileService;