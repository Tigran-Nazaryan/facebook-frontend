"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IUser, ISearchResponse, IFriendRequest } from "@/types/types";
import useDebounce from "@/hooks/useDebounce";
import searchService from "@/service/search";
import UserList from "@/components/uiComponenets/UserList";
import { PaginationDemo } from "@/components/uiComponenets/Pager";
import FriendService from "@/service/friend";
import {useAuth} from "@/store/Auth";

const Home = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [incomingRequests, setIncomingRequests] = useState<IFriendRequest[]>([]);
  const [viewMode, setViewMode] = useState<"all" | "received">("all");

  const fetchUsers = async (q: string, page: number) => {
    try {
      setLoading(true);
      const data: ISearchResponse = await searchService.searchUsers(q, page, 10);
      setUsers(data.users);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const {user} = useAuth();

  const fetchIncomingRequests = async (switchView: boolean = false) => {
    try {
      const userId = Number(user?.id);
      const reqs = await FriendService.getReceivedRequests(userId);
      setIncomingRequests(reqs);
      if (switchView) {
        setViewMode("received");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (searchParams.get("justRegistered") === "true") {
      alert("Registration successful! Confirm your account via email.");
      router.replace("/auth");
    }
  }, [searchParams, router]);

  useEffect(() => {
    fetchUsers("", 1);
    fetchIncomingRequests(false);
  }, []);

  const debouncedSearch = useDebounce((value: string) => {
    fetchUsers(value, 1).catch(console.error);
  }, 500);

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await FriendService.acceptRequest(requestId);

      setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));

      setUsers((prev) =>
        prev.map((u) => {
          if (u.receivedRequest?.id === requestId) {
            return { ...u, friendStatus: "accepted" };
          }
          return u;
        })
      );

      if (viewMode === "received" && incomingRequests.length === 1) {
        setViewMode("all");
        fetchUsers(query, currentPage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    console.log('requestId', requestId)
    try {
      await FriendService.deleteRequest(requestId);


      setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));

      setUsers((prev) =>
        prev.map((u) => {
          if (u.sentRequest?.id === requestId) {
            return { ...u, friendStatus: null, sentRequest: undefined };
          }
          if (u.receivedRequest?.id === requestId) {
            return { ...u, friendStatus: null, receivedRequest: undefined };
          }
          return u;
        })
      );

      console.log("request id ", requestId)

      // If we're in received mode and no more requests, switch back to all users
      if (viewMode === "received" && incomingRequests.length === 1) {
        setViewMode("all");
        fetchUsers(query, currentPage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddFriend = async (userId: number) => {
    try {
      const req = await FriendService.sendRequest(userId);
      console.log('users', users)
      console.log('req', req)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, friendStatus: "pending", sentRequest: req, receivedRequest: undefined }
            : u
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetFilters = () => {
    setQuery("");
    setCurrentPage(1);
    setViewMode("all");
    fetchUsers("", 1);
  };

  const handleReceivedClick = () => {
    fetchIncomingRequests(true);
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-2xl border border-gray-300
                 focus:border-blue-500 outline-none shadow-sm transition duration-200"
        />
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition cursor-pointer"
        >
          Reset Filters
        </button>

        <button
          onClick={handleReceivedClick}
          className={`px-4 py-2 rounded-lg text-white transition cursor-pointer relative ${
            viewMode === "received" ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Received
          {incomingRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {incomingRequests.length}
            </span>
          )}
        </button>
      </div>

      {loading && <p className="mt-2 text-gray-500">Loading...</p>}

      {/* View Mode: Received Requests */}
      {viewMode === "received" && (
        <div className="mb-6">
          {incomingRequests.length > 0 ? (
            <>
              <h2 className="text-lg font-semibold mb-3 text-gray-800">
                Incoming Friend Requests ({incomingRequests.length})
              </h2>
              <ul className="space-y-2">
                {incomingRequests.map((req) => (
                  <li
                    key={req.id}
                    className="flex justify-between items-center p-3 bg-white border rounded-lg hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-3">
                      {req.sender?.coverPhoto ? (
                        <img
                          src={req.sender.coverPhoto}
                          alt={`${req.sender.firstName} ${req.sender.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-medium">
                          {`${req.sender?.firstName?.[0] || ""}${req.sender?.lastName?.[0] || ""}`.toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-gray-800">
                        {req.sender?.firstName && req.sender?.lastName
                          ? `${req.sender.firstName} ${req.sender.lastName}`
                          : req.sender?.firstName || "Unknown User"}
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
            </>
          ) : (
            <div className="border rounded-lg p-8 bg-gray-50 text-center">
              <p className="text-gray-500">No incoming friend requests</p>
            </div>
          )}
        </div>
      )}

      {/* View Mode: All Users */}
      {viewMode === "all" && (
        <>
          <UserList
            users={users}
            onAddFriend={handleAddFriend}
            onCancelRequest={handleRejectRequest}
            onAcceptRequest={handleAcceptRequest}
          />

          <div className="mt-4">
            <PaginationDemo
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => fetchUsers(query, page)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

