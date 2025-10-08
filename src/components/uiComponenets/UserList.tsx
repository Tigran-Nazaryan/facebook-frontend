"use client";

import { UserPlus, XCircle, CheckCircle } from "lucide-react";
import { IUser } from "@/types/types";
import { useAuth } from "@/store/Auth";

interface UserListProps {
  users: IUser[];
  onAddFriend: (userId: number) => void;
  onCancelRequest: (requestId: number, userId: number) => void;
  onAcceptRequest: (requestId: number, userId: number) => void;
  onRejectRequest: (requestId: number, userId: number) => void;
}

const UserList = ({
                    users,
                    onAddFriend,
                    onCancelRequest,
                    onAcceptRequest,
                    onRejectRequest,
                  }: UserListProps) => {
  if (users.length === 0) {
    return <div className="mt-4 text-center text-gray-500">No users found</div>;
  }

  const {user: authUser} = useAuth();

  return (
    <ul className="mt-4 flex flex-col gap-4">
      {users.map((user) => {
        const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;
        let buttonContent;

        if (user.friendStatus === "accepted") {
          buttonContent = (
            <span className="px-3 py-1 rounded-lg text-green-600 font-medium">Friend</span>
          );
        }

        else if (user.sentRequest && user.sentRequest.status === 'pending' && user?.id != authUser?.id) {

          const requestId = user.sentRequest!.id;

          buttonContent = (
            <div className="flex gap-2">
              <button
                onClick={() => onAcceptRequest(requestId, user.id)}
                className="px-3 py-1 rounded-lg bg-green-500 text-white flex items-center gap-1 hover:bg-green-600 transition"
              >
                <CheckCircle size={16} /> Accept
              </button>
              <button
                onClick={() => onRejectRequest(requestId, user.id)}
                className="px-3 py-1 rounded-lg bg-red-500 text-white flex items-center gap-1 hover:bg-red-600 transition"
              >
                <XCircle size={16} /> Reject
              </button>
            </div>
          );
        } else if (user?.receivedRequest?.senderId == authUser?.id) {
          const requestId = user?.receivedRequest!.id;

          buttonContent = (
            <button
              onClick={() => onCancelRequest(requestId, user.id)}
              className="px-3 py-1 rounded-lg bg-gray-800 text-white flex items-center gap-2 cursor-pointer hover:bg-gray-600 transition"
            >
              Pending <XCircle size={16} />
            </button>
          );
        }

        else {
          buttonContent = (
            <button
              onClick={() => onAddFriend(user.id)}
              className="flex items-center rounded-lg justify-center gap-2 px-3 py-1 bg-black text-white hover:bg-gray-800 transition cursor-pointer"
            >
              <UserPlus size={16} />
              Add Friend
            </button>
          );
        }

        return (
          <li
            key={user.id}
            className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-medium">
                {initials.toUpperCase()}
              </div>
              <span className="text-gray-800 font-medium">
                {user.firstName} {user.lastName}
              </span>
            </div>
            {buttonContent}
          </li>
        );
      })}
    </ul>
  );
};

export default UserList;
