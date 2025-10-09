import { IMessage } from "@/types/types";
import $api from "@/http";

export default class MessageService {
  static async messages(userId: number, friendId: number): Promise<IMessage[]> {
    const { data } = await $api.get(`/message/${userId}/${friendId}`);
    return data;
  }

  static async send(senderId: number, receiverId: number, message: string): Promise<IMessage> {
    const { data } = await $api.post("/message", { senderId, receiverId, message });
    return data;
  }
}
