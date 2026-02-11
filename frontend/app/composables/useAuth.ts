import type { LoginResponse, LoginResult, User } from "~/types/auth";

export const useAuth = () => {
  const config = useRuntimeConfig();
  const router = useRouter();

  const userState = useState<User | null>("auth_user", () => null);
  //base api url
  const API_URL = config.public.apiBase || "http://localhost:8000/api";
  const initUser = () => {
    if (process.client) {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        userState.value = JSON.parse(userJson);
      }
    }
  };
  // initUser();
  //login
  const login = async (
    email: string,
    password: string,
  ): Promise<LoginResult> => {
    try {
      const response = await $fetch<LoginResponse>(`${API_URL}/login`, {
        method: "POST",
        body: {
          email,
          password,
        },
      });

      if (response.access_token) {
        // Store token and user data
        localStorage.setItem("auth_token", response.access_token);
        localStorage.setItem("user", JSON.stringify(response.user));
        userState.value = response.user;
        // Redirect ke /dashboard saja
        // Biarkan dashboard/index.vue yang handle redirect ke role masing-masing
        router.push("/dashboard");

        return { success: true, user: response.user };
      }

      return { success: false, error: "Invalid response from server" };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        error:
          error.data?.message || "Login failed. Please check your credentials.",
      };
    }
  };

  //Logout
  const logout = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("auth_token");

      if (token) {
        await $fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      //hapus storage lokal
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");

      userState.value = null;
      router.push("/");
    }
  };

  //get current user
  const getCurrentUser = (): User | null => {
    return userState.value;
  };

  //cek user sudah terautentikasi
  const isAuthenticated = (): boolean => {
    return !!userState.value;
  };

  //get autentikasi token
  const getToken = (): string | null => {
    return localStorage.getItem("auth_token");
  };

  return {
    userState,
    initUser,
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    getToken,
  };
};
