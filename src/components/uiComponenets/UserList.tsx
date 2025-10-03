"use client";

import Image from "next/image";
import { UserPlus, XCircle, CheckCircle } from "lucide-react";
import { IUser } from "@/types/types";

interface UserListProps {
  users: IUser[];
  onAddFriend: (userId: number) => void;
  onCancelRequest: (requestId: number) => void;
  onAcceptRequest: (requestId: number) => void;
}

const UserList = ({ users, onAddFriend, onCancelRequest, onAcceptRequest }: UserListProps) => {
  if (users.length === 0) {
    return <div className="mt-4 text-center text-gray-500">No users found</div>;
  }

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  return (
    <ul className="mt-4 flex flex-col gap-4">
      {users.map((user) => {
        console.log('hjhjhghjghj', user)
        const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;

        return (
          <li
            key={user.id}
            className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              {user.coverPhoto ? (
                <Image
                  src={`${BASE_URL}/${user.coverPhoto}`}
                  alt={`${user.firstName} ${user.lastName}`}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-medium">
                  {initials.toUpperCase()}
                </div>
              )}
              <span className="text-gray-800 font-medium">
                {user.firstName} {user.lastName}
              </span>
            </div>

            {user.receivedRequest ? (
              user.friendStatus === "accepted" ? (
                <span className="px-3 py-1 rounded-lg text-green-600 font-medium">
                  Friend
                </span>
              ) : user.receivedRequest?.status === "rejected" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => onAcceptRequest(user.receivedRequest!.id)}
                    className="px-3 py-1 rounded-lg bg-green-500 text-white flex items-center gap-1"
                  >
                    <CheckCircle size={16} /> Accept
                  </button>
                  <button
                    onClick={() => onCancelRequest(user.receivedRequest?.id)}
                    className="px-3 py-1 rounded-lg bg-red-500 text-black flex items-center gap-1"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              ) : user.receivedRequest?.status === "pending" ? (
                <button
                  onClick={() => onCancelRequest(user.receivedRequest?.id || null)}
                  className="px-3 py-1 rounded-lg text-black flex items-center gap-2 cursor-pointer"
                >
                  Pending <XCircle size={16} />
                </button>
              ) : (
                <button
                  onClick={() => onAddFriend(user.id)}
                  className="flex items-center rounded-lg justify-center gap-2 px-3 py-1 bg-black text-white hover:bg-gray-800 transition cursor-pointer"
                >
                  <UserPlus size={16} />
                  Add Friend
                </button>
              )
            ) : (
              <button
                onClick={() => onAddFriend(user.id)}
                className="flex items-center rounded-lg justify-center gap-2 px-3 py-1 bg-black text-white hover:bg-gray-800 transition cursor-pointer"
              >
                <UserPlus size={16} />
                Add Friend
              </button>
            ) }
          </li>
        );
      })}
    </ul>
  );
};

export default UserList;

