"use client";

import { useState, useEffect, ChangeEvent } from "react";
import searchService from "@/service/search";
import FriendService from "@/service/friend";
import UserList from "@/components/uiComponenets/UserList";
import { PaginationDemo } from "@/components/uiComponenets/Pager";
import { IUser } from "@/types/types";
import useDebounce from "@/hooks/useDebounce";

const Home = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");

  const fetchUsers = async (q = "", page = 1, filterMode = "") => {
    setLoading(true);
    try {
      const data = await searchService.search(q, page, 10, filterMode);

      setUsers(data.users || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("🔴 fetchUsers error:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useDebounce((value: string) => {
    fetchUsers(value, 1, filter);
  }, 500);

  useEffect(() => {
    console.log("users fetched");
    debouncedSearch(query);
  }, [query, filter]);

  const handleAddFriend = async (userId: number) => {
    try {
      const newRequest = await FriendService.sendRequest(userId);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
              ...u,
              friendStatus: "pending",
              receivedRequest: newRequest,
            }
            : u
        )
      );
    } catch (err) {
      console.error("🔴 Error sending friend request:", err);
    }
  };

  const handleCancelSentRequest = async (requestId: number, userId: number) => {
    try {
      await FriendService.deleteRequest(requestId);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? ({...u, receivedRequest: undefined }) : u
        )
      );
    } catch (err) {
      console.error("🔴 Error cancelling request:", err);
    }
  };

  const handleAcceptRequest = async (requestId: number, userId: number) => {
    try {
      await FriendService.acceptRequest(requestId);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? ({...u, friendStatus: "accepted" }) : u
        )
      );

      console.log(users.find(u => u.id === userId));
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  const handleRejectRequest = async (requestId: number, userId: number) => {
    try {
      await FriendService.deleteRequest(requestId);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? ({...u, sentRequest: undefined }) : u
        )
      );
    } catch (err) {
      console.error("🔴 Error rejecting request:", err);
    }
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilter(value);
    setCurrentPage(1);
    fetchUsers(query, 1, value);
  };

  const handleResetFilters = () => {
    setQuery("");
    setFilter("");
    setCurrentPage(1);
    fetchUsers("", 1, "");
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-2xl border border-gray-300 focus:border-blue-500 outline-none shadow-sm transition duration-200"
        />

        <select
          value={filter}
          onChange={handleFilterChange}
          className="px-4 py-2 rounded-lg border border-gray-300 outline-none cursor-pointer"
        >
          <option value="">All Users</option>
          <option value="friends">Friends</option>
          <option value="received">Received Requests</option>
        </select>

        <button
          onClick={handleResetFilters}
          className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      {loading && <p className="mt-2 text-gray-500">Loading...</p>}

      <UserList
        users={users}
        onAddFriend={handleAddFriend}
        onCancelRequest={handleCancelSentRequest}
        onAcceptRequest={handleAcceptRequest}
        onRejectRequest={handleRejectRequest}
      />
      <div className="mt-4">
        <PaginationDemo
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => fetchUsers(query, page, filter)}
        />
      </div>
    </div>
  );
};

export default Home;
