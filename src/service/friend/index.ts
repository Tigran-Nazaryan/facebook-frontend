import $api from "@/http";
import {IFriendRequest } from "@/types/types";

export default class FriendService {
  static async sendRequest(receiverId: number): Promise<IFriendRequest> {
    const { data } = await $api.post("/friend", { receiverId });
    return data.data;
  }

  static async getReceivedRequests(userId: number): Promise<IFriendRequest[]> {
    const { data } = await $api.get(`/friend/received/${userId}`);
    return data.data;
  }

  static async getSentRequests(userId: number): Promise<IFriendRequest[]> {
    const { data } = await $api.get(`/friend/sent/${userId}`);
    return data.data;
  }

  static async acceptRequest(requestId: number): Promise<IFriendRequest> {
    const { data } = await $api.post(`/friend/${requestId}/accept`);
    return data.data;
  }

  static async deleteRequest(requestId: number): Promise<void> {
    await $api.delete(`/friend/${requestId}`);
  }

  static async removeFriend(friendId: number): Promise<void> {
    await $api.delete(`/friend/${friendId}/remove`);
  }
}
