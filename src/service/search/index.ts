import { IUser } from "@/types/types";
import $api from "@/http";

class SearchService {
  async searchUsers(query?: string): Promise<IUser[]> {
    try {
      const params: any = {};
      if (query && query.trim() !== "") {
        params.q = query.trim();
      }

      const { data } = await $api.get<IUser[]>("/search/users", { params });

      if (!Array.isArray(data)) {
        throw new Error("Search failed: invalid response");
      }

      return data;
    } catch (error: any) {
      console.error("Frontend search error:", error);
      return [];
    }
  }
}

export default new SearchService();
