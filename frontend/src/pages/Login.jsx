import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inicia sesión en tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{" "}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              crea una nueva cuenta
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className={`input ${errors.email ? "border-danger-500" : ""}`}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`input pr-10 ${
                    errors.password ? "border-danger-500" : ""
                  }`}
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="btn btn-primary btn-lg w-full"
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Credenciales de prueba:
          </h3>
          <p className="text-xs text-blue-700">
            Email: demo@mibalance.com
            <br />
            Contraseña: password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
