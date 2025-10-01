import { ISearchResponse } from "@/types/types";
import $api from "@/http";

class SearchService {
  async searchUsers(query?: string, page: number = 1, limit: number = 10): Promise<ISearchResponse> {
    try {
      const params: any = { page, limit };
      if (query && query.trim() !== "") {
        params.q = query.trim();
      }

      const { data } = await $api.get<ISearchResponse>("/search/users", { params });

      if (!data || !Array.isArray(data.users)) {
        throw new Error("Search failed: invalid response");
      }

      return data;
    } catch (error: any) {
      console.error("Frontend search error:", error);
      return {
        users: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 1,
      };
    }
  }
}

export default new SearchService();
