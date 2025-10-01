import { IUser } from "@/types/types";
import Image from "next/image";
import { UserPlus } from "lucide-react";

interface UserListProps {
  users: IUser[];
  onAddFriend: (userId: number) => void;
}

const UserList = ({ users, onAddFriend }: UserListProps) => {
  if (users.length === 0) {
    return (
      <div className="mt-4 text-center text-gray-500">
        No users found
      </div>
    );
  }

  return (
    <ul className="mt-4 flex flex-col gap-4">
      {users.map((user) => {
        const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;

        return (
          <li
            key={user.id}
            className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              {user.coverPhoto ? (
                <Image
                  src={user.coverPhoto}
                  alt={`${user.firstName} ${user.lastName}`}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
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

            <button
              onClick={() => onAddFriend(user.id)}
              className="flex items-center rounded-lg justify-center gap-2 px-3 py-1 bg-black text-white hover:bg-gray-800 transition cursor-pointer"
            >
              <UserPlus size={16} />
              Add Friend
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default UserList;
