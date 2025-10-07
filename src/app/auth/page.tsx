 "use client";

import { useState, useEffect, ChangeEvent } from "react";
import searchService from "@/service/search";
import FriendService from "@/service/friend";
import UserList from "@/components/uiComponenets/UserList";
import { PaginationDemo } from "@/components/uiComponenets/Pager";
import { IFriendRequest, IUser } from "@/types/types";
import useDebounce from "@/hooks/useDebounce";

const Home = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [incomingRequests, setIncomingRequests] = useState<IFriendRequest[]>([]);
  const [filter, setFilter] = useState("");

  const fetchUsers = async (q = "", page = 1, filterMode = "") => {
    setLoading(true);
    try {
      const data = await searchService.search(q, page, 10, filterMode);

      setUsers(data.users || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);

      if (filterMode === "received") {
        const received = data.users
          .filter((u: IUser) => u.receivedRequest)
          .map((u: IUser) => u.receivedRequest);

        setIncomingRequests(
          received.filter((r): r is IFriendRequest => r !== undefined)
        );
      } else {
        setIncomingRequests([]);
      }
    } catch (err) {
      console.error("🔴 fetchUsers error:", err);
      setUsers([]);
      setIncomingRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useDebounce((value: string) => {
    fetchUsers(value, 1, filter);
  }, 500);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, filter]);

  useEffect(() => {
    fetchUsers("", 1, filter);
  }, []);

  console.log("users", users)

  const handleAddFriend = async (userId: number) => {
    try {
      const newRequest = await FriendService.sendRequest(userId);

      console.log("🔹 Friend request sent:", newRequest);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
              ...u,
              friendStatus: "pending",
              sentRequest: newRequest,
              receivedRequest: undefined,
            }
            : u
        )
      );
    } catch (err) {
      console.error("🔴 Error sending friend request:", err);
    }
  };

  const handleCancelSentRequest = async (requestId: number) => {
    try {
      await FriendService.deleteRequest(requestId);

      console.log("🔹 Request cancelled:", requestId);

      setUsers((prev) =>
        prev.map((u) =>
          u.sentRequest && u.sentRequest.id === requestId
            ? { ...u, friendStatus: null, sentRequest: undefined }
            : u
        )
      );
    } catch (err) {
      console.error("🔴 Error cancelling request:", err);
    }
  };

  // const handleAcceptRequest = async (requestId: number) => {
  //   try {
  //     await FriendService.acceptRequest(requestId);
  //
  //     console.log("🔹 Request accepted:", requestId);
  //
  //     setUsers((prev) =>
  //       prev.map((u) =>
  //         u.receivedRequest && u.receivedRequest.id === requestId
  //           ? { ...u, friendStatus: "accepted", receivedRequest: undefined }
  //           : u
  //       )
  //     );
  //
  //     setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
  //   } catch (err) {
  //     console.error("🔴 Error accepting request:", err);
  //   }
  // };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await FriendService.acceptRequest(requestId);

      setUsers((prev) =>
        prev.map((u) => {
          if (u.receivedRequest?.id === requestId || u.sentRequest?.id === requestId) {
            return { ...u, friendStatus: "accepted", receivedRequest: null, sentRequest: null };
          }
          return u;
        })
      );
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };


  const handleRejectRequest = async (requestId: number) => {
    try {
      await FriendService.deleteRequest(requestId);

      console.log("🔹 Request rejected:", requestId);

      setUsers((prev) =>
        prev.map((u) => {
          if (u.sentRequest && u.sentRequest.id === requestId) {
            return { ...u, friendStatus: null, sentRequest: undefined };
          }
          if (u.receivedRequest && u.receivedRequest.id === requestId) {
            return { ...u, friendStatus: null, receivedRequest: undefined };
          }
          return u;
        })
      );

      setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
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

      {filter === "received" ? (
        incomingRequests.length > 0 ? (
          <ul className="space-y-2">
            {incomingRequests.map((req) => (
              <li
                key={req.id}
                className="flex justify-between items-center p-3 bg-white border rounded-lg hover:shadow-sm transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-medium">
                    {`${req.sender?.firstName?.[0] || ""}${req.sender?.lastName?.[0] || ""}`.toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-800">
                    {req.sender?.firstName} {req.sender?.lastName}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(req.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectRequest(req.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="border rounded-lg p-8 bg-gray-50 text-center">
            <p className="text-gray-500">No incoming friend requests</p>
          </div>
        )
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default Home;