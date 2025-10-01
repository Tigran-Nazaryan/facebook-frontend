"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IUser } from "@/types/types";
import useDebounce from "@/hooks/useDebounce";
import searchService from "@/service/search";
import UserList from "@/components/uiComponenets/UserList";

const Home = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await searchService.searchUsers("");
        setUsers(data);
      } catch (error) {
        console.error(error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchParams.get("justRegistered") === "true") {
      alert("Registration successful! Confirm your account via email.");
      router.replace("/auth");
    }
  }, [searchParams, router]);

  const debouncedSearch = useDebounce(async (value: string) => {
    try {
      setLoading(true);
      const data = await searchService.searchUsers(value);
      console.log("Search result count:", data.length);
      setUsers(data);
    } catch (error) {
      console.error(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleAddFriend = (userId: number) => {
    console.log("Add friend clicked for userId:", userId);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-md px-4 py-2 rounded-2xl border border-gray-300
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-400
                   outline-none shadow-sm transition duration-200"
      />

      {loading && <p className="mt-2 text-gray-500">Loading...</p>}

      <UserList users={users} onAddFriend={handleAddFriend} />
    </div>
  );
};

export default Home;
