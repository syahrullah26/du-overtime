import type { User } from "~/types/auth";

interface LoginResponse {
  success: boolean;
  user: User;
  message: string;
}

interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

export const useAuth = () => {
  const router = useRouter();
  const userCookie = useCookie<User | null>("user_data");
  const tokenCookie = useCookie<string | null>("auth_token");

  //expose userState
  const userState = computed(() => userCookie.value);

  // Login
  const login = async (
    email: string,
    password: string,
  ): Promise<LoginResult> => {
    try {
      const response = await useApiFetch<LoginResponse>("/login", {
        method: "POST",
        body: { email, password },
      });

      if (response.success) {
        //Cookie di set server (auth_token)
        //Set user data cookie untuk persistence di client/middleware
        userCookie.value = response.user;

        //Redirect ke /dashboard
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

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await useApiFetch("/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      //clear cookies user di clientside
      userCookie.value = null;
      router.push("/");
    }
  };

  // current user dari cookie
  const getCurrentUser = (): User | null => {
    if (process.client) {
      return userCookie.value;
    }
    return null;
  };

  //cek user terautentikasi
  const isAuthenticated = (): boolean => {
    if (process.client) {
      // cek cookiesny ada atau nggak
      return !!userCookie.value;
    }
    return false;
  };

  // get token httpOnly (server side only gbs diakses dari client si tokenny)
  const getToken = (): string | null => {
    //gpp null, tiap request pasti si token kekirim
    return null;
  };

  return {
    userState,
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    getToken,
  };
};
