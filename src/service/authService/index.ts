import $api from "@/http";
import {IAuthResponse, IRegistrationRequest, IUser} from "@/types/types";

export default class AuthService {
  static async login(email: string, password: string): Promise<IAuthResponse> {
    const { data } = await $api.post("/auth/login", { email, password });
    if (!data?.accessToken) {
      throw new Error(data.message || "Login failed");
    }

    $api.setAuthToken(data.accessToken);

    return data;
  }

  static async registration(email: string, password: string, firstName: string, lastName: string, birthday?: string, gender?: string):
    Promise<IRegistrationRequest> {
    const { data } = await $api.post("/auth/register", {email, password, firstName, lastName, birthday, gender});

    return data;
  }

  static async logout(): Promise<void> {
    await $api.post("/auth/logout");
    $api.clearAuthToken();
  }

  static async verify(): Promise<{ user: IUser }> {
    const { data } = await $api.get("/auth/verify");
    if (!data.user) {
      throw new Error("User not verified");
    }
    return data;
  }
}
