import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Target, TrendingUp } from "lucide-react";
import { savingsGoalService } from "../services/savingsGoalService";
import LoadingSpinner from "../components/LoadingSpinner";

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "0",
    targetDate: "",
    description: "",
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await savingsGoalService.getSavingsGoals();
      // El backend devuelve { success: true, data: { goals: [...] } }
      setGoals(response.data?.goals || []);
    } catch (error) {
      console.error("Error cargando metas:", error);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await savingsGoalService.updateSavingsGoal(editingGoal.id, formData);
      } else {
        await savingsGoalService.createSavingsGoal(formData);
      }
      setShowModal(false);
      setEditingGoal(null);
      setFormData({
        name: "",
        targetAmount: "",
        currentAmount: "0",
        targetDate: "",
        description: "",
      });
      loadGoals();
    } catch (error) {
      console.error("Error guardando meta:", error);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: goal.targetDate.split("T")[0],
      description: goal.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta meta?")) {
      try {
        await savingsGoalService.deleteSavingsGoal(id);
        loadGoals();
      } catch (error) {
        console.error("Error eliminando meta:", error);
      }
    }
  };

  const handleAddAmount = async (goalId, amount) => {
    try {
      const goal = goals.find((g) => g.id === goalId);
      const newAmount = goal.currentAmount + parseFloat(amount);
      await savingsGoalService.updateSavingsGoal(goalId, {
        ...goal,
        currentAmount: newAmount,
      });
      loadGoals();
    } catch (error) {
      console.error("Error actualizando meta:", error);
    }
  };

  const calculateProgress = (current, target) => {
    if (!current || !target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (targetDate) => {
    if (!targetDate) return 0;
    try {
      const today = new Date();
      const target = new Date(targetDate);
      const diffTime = target - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(diffDays, 0);
    } catch (error) {
      console.error("Error calculating days remaining:", error);
      return 0;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Metas de Ahorro</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Meta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = calculateProgress(
            goal.currentAmount,
            goal.targetAmount
          );
          const daysRemaining = getDaysRemaining(goal.targetDate);
          const isCompleted = goal.currentAmount >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                    <p className="text-sm text-gray-500">
                      {isCompleted
                        ? "¡Completada!"
                        : `${daysRemaining} días restantes`}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progreso</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCompleted ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Actual:</span>
                  <span className="font-medium">
                    ${goal.currentAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Meta:</span>
                  <span className="font-medium">
                    ${goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Faltante:</span>
                  <span className="font-medium text-red-600">
                    ${(goal.targetAmount - goal.currentAmount).toLocaleString()}
                  </span>
                </div>
              </div>

              {!isCompleted && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Cantidad"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const amount = parseFloat(e.target.value);
                        if (amount > 0) {
                          handleAddAmount(goal.id, amount);
                          e.target.value = "";
                        }
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      const amount = parseFloat(input.value);
                      if (amount > 0) {
                        handleAddAmount(goal.id, amount);
                        input.value = "";
                      }
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-1"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Agregar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes metas de ahorro
          </h3>
          <p className="text-gray-600 mb-4">
            Crea tu primera meta de ahorro para empezar a ahorrar de manera
            organizada.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Crear Primera Meta
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingGoal ? "Editar Meta" : "Nueva Meta de Ahorro"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la meta
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Vacaciones, Auto nuevo, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto objetivo
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.targetAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, targetAmount: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto actual
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.currentAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentAmount: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha objetivo
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.targetDate}
                    onChange={(e) =>
                      setFormData({ ...formData, targetDate: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Describe tu meta de ahorro..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingGoal(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {editingGoal ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoals;
