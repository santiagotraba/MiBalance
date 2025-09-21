import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Filter, Search } from "lucide-react";
import { transactionService } from "../services/transactionService";
import { categoryService } from "../services/categoryService";
import LoadingSpinner from "../components/LoadingSpinner";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    search: "",
  });

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    type: "EXPENSE",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, categoriesData] = await Promise.all([
        transactionService.getTransactions(),
        categoryService.getCategories(),
      ]);
      setTransactions(transactionsData);
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
      if (editingTransaction) {
        await transactionService.updateTransaction(
          editingTransaction.id,
          formData
        );
      } else {
        await transactionService.createTransaction(formData);
      }
      setShowModal(false);
      setEditingTransaction(null);
      setFormData({
        amount: "",
        description: "",
        type: "EXPENSE",
        categoryId: "",
        date: new Date().toISOString().split("T")[0],
      });
      loadData();
    } catch (error) {
      console.error("Error guardando transacción:", error);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount.toString(),
      description: transaction.description,
      type: transaction.type,
      categoryId: transaction.categoryId.toString(),
      date: transaction.date.split("T")[0],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta transacción?")
    ) {
      try {
        await transactionService.deleteTransaction(id);
        loadData();
      } catch (error) {
        console.error("Error eliminando transacción:", error);
      }
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = !filters.type || transaction.type === filters.type;
    const matchesCategory =
      !filters.category ||
      transaction.categoryId.toString() === filters.category;
    const matchesSearch =
      !filters.search ||
      transaction.description
        .toLowerCase()
        .includes(filters.search.toLowerCase());

    return matchesType && matchesCategory && matchesSearch;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transacciones</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Transacción
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="INCOME">Ingresos</option>
              <option value="EXPENSE">Gastos</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                placeholder="Buscar transacciones..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de transacciones */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const category = categories.find(
                  (c) => c.id === transaction.categoryId
                );
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: category?.color + "20",
                          color: category?.color,
                        }}
                      >
                        {category?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === "INCOME"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type === "INCOME" ? "Ingreso" : "Gasto"}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "INCOME" ? "+" : "-"}$
                      {transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTransaction
                  ? "Editar Transacción"
                  : "Nueva Transacción"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="INCOME">Ingreso</option>
                    <option value="EXPENSE">Gasto</option>
                  </select>
                </div>
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
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingTransaction(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {editingTransaction ? "Actualizar" : "Crear"}
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

export default Transactions;
