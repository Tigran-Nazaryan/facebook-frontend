"use client";

import {useState, useRef, useEffect} from "react";
import {useForm} from "react-hook-form";
import {useParams} from "next/navigation";
import MessageService from "@/service/chat";
import {IMessage, IFormInput, IMessageFromAPI} from "@/types/types";
import {useAuth} from "@/store/Auth";
import {io} from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

const MessagePage = () => {
  const {user} = useAuth();
  const params = useParams();
  const friendId = Number(params.friendId);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {register, handleSubmit, reset} = useForm<IFormInput>({
    defaultValues: {message: ""},
  });

  const userId = user?.id;

  const isUserAtBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;

    const threshold = 100;
    const position = container.scrollHeight - container.scrollTop - container.clientHeight;
    return position < threshold;
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({behavior});
  };

  useEffect(() => {
    if (messages.length > 0 && isUserAtBottom()) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [messages]);

  useEffect(() => {
    if (!userId) return;

    socket.emit("joinRoom", userId);

    socket.on("receiveMessage", (data) => {
      if (data.receiverId === userId) {
        console.log("Received message", data);
        setMessages((prev) => [
          ...prev,
          {
            id: data.id,
            isMe: false,
            text: data.message,
            sender: data.sender,
            createdAt: data.createdAt,
          },
        ]);
      }
    });

    socket.on("messageSent", (data) => {
      console.log("✅ Message sent:", data);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageSent");
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || !friendId) return;

    const loadMessages = async () => {
      try {
        const response = await MessageService.messages(userId, friendId);
        const msgs = response as unknown as IMessageFromAPI[];

        setMessages(
          msgs.map((m) => ({
            id: m.id,
            isMe: m.senderId === userId,
            text: m.message,
            sender: m.sender,
            createdAt: m.createdAt,
          }))
        );

        setTimeout(() => scrollToBottom("auto"), 100);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    loadMessages();
  }, [userId, friendId]);

  const sendMessage = async (data: IFormInput) => {
    if (!userId || !friendId || !data.message.trim()) return;

    try {
      const response = await MessageService.send(userId, friendId, data.message);
      const newMsg = response as unknown as IMessageFromAPI;

      setMessages((prev) => [
        ...prev,
        {
          id: newMsg.id,
          isMe: true,
          text: newMsg.message,
          sender: newMsg.sender,
          createdAt: newMsg.createdAt,
        },
      ]);

      reset();
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  if (!userId || !friendId) return <p>Loading...</p>;
  console.log("message", messages);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 bg-white shadow-md flex items-center gap-3">
        <h2 className="text-lg font-medium">Chat with Friend</h2>
      </div>
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isMe ? "justify-end" : "justify-start"} items-end gap-2`}
          >
            {!msg.isMe && msg.sender && (
              msg.sender.coverPhoto ? (
                <img
                  src={msg.sender.coverPhoto}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full p-6 flex items-center justify-center text-white font-bold text-xl bg-black">
                  {msg.sender.firstName?.[0]}
                  {msg.sender.lastName?.[0]}
                </div>
              )
            )}

            <div
              className={`p-3 rounded-lg max-w-xs break-words ${
                msg.isMe
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none shadow"
              }`}
            >
              <div>{msg.text}</div>
              <div className="text-xs text-gray-400 mt-1">
                <span className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}/>
      </div>

      <form
        onSubmit={handleSubmit(sendMessage)}
        className="p-4 bg-white flex gap-2 shadow-md"
      >
        <input
          {...register("message")}
          placeholder="Write message..."
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition cursor-pointer"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessagePage;
