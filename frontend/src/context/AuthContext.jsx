import { createContext, useContext, useReducer, useEffect } from "react";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authService.verifyToken();
          if (response.success) {
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                user: response.data.user,
                token,
              },
            });
          } else {
            localStorage.removeItem("token");
            dispatch({ type: "LOGOUT" });
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem("token");
          dispatch({ type: "LOGOUT" });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await authService.login(email, password);

      if (response.success) {
        localStorage.setItem("token", response.data.token);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data,
        });
        toast.success("¡Bienvenido!");
        return { success: true };
      } else {
        toast.error(response.error || "Error al iniciar sesión");
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error de conexión");
      return { success: false, error: "Error de conexión" };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const register = async (name, email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await authService.register(name, email, password);

      if (response.success) {
        localStorage.setItem("token", response.data.token);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data,
        });
        toast.success("¡Cuenta creada exitosamente!");
        return { success: true };
      } else {
        toast.error(response.error || "Error al registrarse");
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Error de conexión");
      return { success: false, error: "Error de conexión" };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    toast.success("Sesión cerrada");
  };

  const updateUser = (userData) => {
    dispatch({
      type: "UPDATE_USER",
      payload: userData,
    });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
