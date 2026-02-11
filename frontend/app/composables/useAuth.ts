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
        //Store token dan data user ke lokal storage
        localStorage.setItem("auth_token", response.access_token);
        localStorage.setItem("user", JSON.stringify(response.user));

        userState.value = response.user;
        //redirect sesuai role
        redirectToDashboard(response.user.role);

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

  const redirectToDashboard = (role: string): void => {
    const roleRoutes: Record<string, string> = {
      FINANCE: "/dashboard/finance",
      HRD: "/dashboard/hrd",
      PIC: "/dashboard/pic",
      C_LEVEL: "/dashboard/clevel",
      EMPLOYEE: "/dashboard/employee",
    };

    const route = roleRoutes[role] || "/dashboard/employee";
    router.push(route);
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
      router.push("/");
    }
  };

  //get current user
  const getCurrentUser = (): User | null => {
    const userJson = localStorage.getItem("user");
    return userJson ? (JSON.parse(userJson) as User) : null;
  };

  //cek user sudah terautentikasi
  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("auth_token");
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
    redirectToDashboard,
    getCurrentUser,
    isAuthenticated,
    getToken,
  };
};
