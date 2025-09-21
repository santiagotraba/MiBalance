import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, DollarSign, AlertTriangle } from "lucide-react";
import { budgetService } from "../services/budgetService";
import { categoryService } from "../services/categoryService";
import LoadingSpinner from "../components/LoadingSpinner";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    month: new Date().toISOString().slice(0, 7), // YYYY-MM
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetsData, categoriesData] = await Promise.all([
        budgetService.getBudgets(),
        categoryService.getCategories(),
      ]);
      setBudgets(budgetsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget.id, formData);
      } else {
        await budgetService.createBudget(formData);
      }
      setShowModal(false);
      setEditingBudget(null);
      setFormData({
        categoryId: "",
        amount: "",
        month: new Date().toISOString().slice(0, 7),
      });
      loadData();
    } catch (error) {
      console.error("Error guardando presupuesto:", error);
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.categoryId.toString(),
      amount: budget.amount.toString(),
      month: budget.month,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este presupuesto?")
    ) {
      try {
        await budgetService.deleteBudget(id);
        loadData();
      } catch (error) {
        console.error("Error eliminando presupuesto:", error);
      }
    }
  };

  const getBudgetStatus = (budget) => {
    const spent = budget.spent || 0;
    const percentage = (spent / budget.amount) * 100;

    if (percentage >= 100) {
      return {
        status: "exceeded",
        color: "text-red-600",
        bgColor: "bg-red-100",
      };
    } else if (percentage >= 80) {
      return {
        status: "warning",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      };
    } else {
      return {
        status: "good",
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    }
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return now.toISOString().slice(0, 7);
  };

  const currentMonthBudgets = budgets.filter(
    (budget) => budget.month === getCurrentMonth()
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Presupuestos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Presupuesto
        </button>
      </div>

      {/* Resumen del mes actual */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Presupuesto del Mes Actual
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Presupuestado</p>
            <p className="text-2xl font-bold text-blue-600">
              $
              {currentMonthBudgets
                .reduce((sum, budget) => sum + budget.amount, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Gastado</p>
            <p className="text-2xl font-bold text-red-600">
              $
              {currentMonthBudgets
                .reduce((sum, budget) => sum + (budget.spent || 0), 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Restante</p>
            <p className="text-2xl font-bold text-green-600">
              $
              {(
                currentMonthBudgets.reduce(
                  (sum, budget) => sum + budget.amount,
                  0
                ) -
                currentMonthBudgets.reduce(
                  (sum, budget) => sum + (budget.spent || 0),
                  0
                )
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de presupuestos */}
      <div className="space-y-4">
        {currentMonthBudgets.map((budget) => {
          const category = categories.find((c) => c.id === budget.categoryId);
          const spent = budget.spent || 0;
          const percentage = (spent / budget.amount) * 100;
          const status = getBudgetStatus(budget);

          return (
            <div key={budget.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: category?.color }}
                  >
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {category?.name}
                    </h3>
                    <p className="text-sm text-gray-500">{budget.month}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status.status === "exceeded" && (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progreso</span>
                  <span className={status.color}>{percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      status.status === "exceeded"
                        ? "bg-red-500"
                        : status.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Presupuestado</p>
                  <p className="font-semibold text-gray-900">
                    ${budget.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Gastado</p>
                  <p className="font-semibold text-red-600">
                    ${spent.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Restante</p>
                  <p
                    className={`font-semibold ${
                      budget.amount - spent >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ${(budget.amount - spent).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {currentMonthBudgets.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes presupuestos para este mes
          </h3>
          <p className="text-gray-600 mb-4">
            Crea presupuestos para controlar tus gastos mensuales.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Crear Primer Presupuesto
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingBudget ? "Editar Presupuesto" : "Nuevo Presupuesto"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories
                      .filter((cat) => cat.type === "EXPENSE")
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mes
                  </label>
                  <input
                    type="month"
                    required
                    value={formData.month}
                    onChange={(e) =>
                      setFormData({ ...formData, month: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingBudget(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {editingBudget ? "Actualizar" : "Crear"}
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

export default Budgets;
