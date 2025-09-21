import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Save, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";
import LoadingSpinner from "../components/LoadingSpinner";

const Settings = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      // Solo incluir contraseña si se proporciona
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage("Las contraseñas no coinciden");
          setSaving(false);
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await userService.updateProfile(updateData);
      setMessage("Perfil actualizado correctamente");

      // Limpiar campos de contraseña
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      setMessage("Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      logout();
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Configuración</h1>

        {/* Información del perfil */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Perfil</h2>
              <p className="text-sm text-gray-600">
                Actualiza tu información personal
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cambiar contraseña
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Deja en blanco si no quieres cambiar la contraseña
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña actual
                  </label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingresa tu contraseña actual"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingresa tu nueva contraseña"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
              </div>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.includes("Error")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>

        {/* Acciones de cuenta */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Acciones de cuenta
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="font-medium text-gray-900">Cerrar sesión</h3>
                  <p className="text-sm text-gray-600">
                    Cierra tu sesión actual
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        {/* Información de la aplicación */}
        <div className="bg-gray-50 rounded-lg p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Información de la aplicación
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p>
                <strong>Versión:</strong> 1.0.0
              </p>
              <p>
                <strong>Última actualización:</strong>{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div>
              <p>
                <strong>Desarrollado por:</strong> MiBalance Team
              </p>
              <p>
                <strong>Contacto:</strong> soporte@mibalance.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
