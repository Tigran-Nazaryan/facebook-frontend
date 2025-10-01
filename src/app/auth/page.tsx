"use client";

import {useSearchParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {IUser, ISearchResponse} from "@/types/types";
import useDebounce from "@/hooks/useDebounce";
import searchService from "@/service/search";
import UserList from "@/components/uiComponenets/UserList";
import {PaginationDemo} from "@/components/uiComponenets/Pager";

const Home = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    (async () => {
      await fetchUsers("", 1);
    })();
  }, []);

  useEffect(() => {
    if (searchParams.get("justRegistered") === "true") {
      alert("Registration successful! Confirm your account via email.");
      router.replace("/auth");
    }
  }, [searchParams, router]);

  const debouncedSearch = useDebounce((value: string) => {
    fetchUsers(value, 1).catch(console.error);
  }, 500);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleAddFriend = (userId: number) => {
    console.log("Add friend clicked for userId:", userId);
  };

  const handlePageChange = async (page: number) => {
    await fetchUsers(query, page);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-2xl border border-gray-300
                 focus:border-blue-500
                 outline-none shadow-sm transition duration-200"
        />
        {loading && <p className="mt-2 text-gray-500">Loading...</p>}
        <UserList users={users} onAddFriend={handleAddFriend}/>
      </div>

      <div className="mt-4">
        <PaginationDemo
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Home;
