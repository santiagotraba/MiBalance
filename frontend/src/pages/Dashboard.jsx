import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { analyticsService } from "../services/analyticsService";
import { formatCurrency, formatDate } from "../utils/formatters";
import LoadingSpinner from "../components/LoadingSpinner";
import ExpenseChart from "../components/charts/ExpenseChart";
import RecentTransactions from "../components/RecentTransactions";
import SavingsGoals from "../components/SavingsGoals";

const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [savingsStats, setSavingsStats] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [balanceRes, recentRes, savingsRes, categoriesRes] =
          await Promise.all([
            analyticsService.getBalance(),
            analyticsService.getRecentTransactions(5),
            analyticsService.getSavingsStats(),
            analyticsService.getCategoryBreakdown("EXPENSE"),
          ]);

        setBalance(balanceRes.data);
        setRecentTransactions(recentRes.data.transactions);
        setSavingsStats(savingsRes.data);
        setCategoryBreakdown(categoriesRes.data.categories.slice(0, 5));
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: "Ingresos del mes",
      value: formatCurrency(balance?.totalIncome || 0),
      change: "+12%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-success-600",
      bgColor: "bg-success-100",
    },
    {
      name: "Gastos del mes",
      value: formatCurrency(balance?.totalExpenses || 0),
      change: "+8%",
      changeType: "negative",
      icon: TrendingDown,
      color: "text-danger-600",
      bgColor: "bg-danger-100",
    },
    {
      name: "Balance actual",
      value: formatCurrency(balance?.balance || 0),
      change: balance?.balance >= 0 ? "Positivo" : "Negativo",
      changeType: balance?.balance >= 0 ? "positive" : "negative",
      icon: DollarSign,
      color: balance?.balance >= 0 ? "text-success-600" : "text-danger-600",
      bgColor: balance?.balance >= 0 ? "bg-success-100" : "bg-danger-100",
    },
    {
      name: "Transacciones",
      value:
        (balance?.transactionCount?.income || 0) +
        (balance?.transactionCount?.expense || 0),
      change: "Este mes",
      changeType: "neutral",
      icon: CreditCard,
      color: "text-primary-600",
      bgColor: "bg-primary-100",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen de tus finanzas personales</p>
        </div>
        <Link to="/transactions" className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Transacción
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="card-content">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-success-600"
                        : stat.changeType === "negative"
                        ? "text-danger-600"
                        : "text-gray-600"
                    }`}
                  >
                    {stat.changeType === "positive" && (
                      <ArrowUpRight className="h-4 w-4 inline mr-1" />
                    )}
                    {stat.changeType === "negative" && (
                      <ArrowDownRight className="h-4 w-4 inline mr-1" />
                    )}
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Gastos por Categoría
            </h3>
            <p className="text-sm text-gray-600">
              Distribución de gastos del mes actual
            </p>
          </div>
          <div className="card-content">
            <ExpenseChart data={categoryBreakdown} />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Transacciones Recientes
            </h3>
            <p className="text-sm text-gray-600">Últimas 5 transacciones</p>
          </div>
          <div className="card-content">
            <RecentTransactions transactions={recentTransactions} />
          </div>
        </div>
      </div>

      {/* Savings Goals */}
      {savingsStats && savingsStats.totalGoals > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Metas de Ahorro
                </h3>
                <p className="text-sm text-gray-600">
                  Progreso de tus objetivos financieros
                </p>
              </div>
              <Link to="/savings-goals" className="btn btn-secondary btn-sm">
                Ver todas
              </Link>
            </div>
          </div>
          <div className="card-content">
            <SavingsGoals showAll={false} />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/transactions"
          className="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="card-content text-center">
            <CreditCard className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">
              Gestionar Transacciones
            </h3>
            <p className="text-sm text-gray-600">
              Agregar, editar o eliminar transacciones
            </p>
          </div>
        </Link>

        <Link
          to="/reports"
          className="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="card-content text-center">
            <TrendingUp className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Ver Reportes</h3>
            <p className="text-sm text-gray-600">
              Análisis detallados y gráficos
            </p>
          </div>
        </Link>

        <Link
          to="/budgets"
          className="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="card-content text-center">
            <Target className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Presupuestos</h3>
            <p className="text-sm text-gray-600">
              Controla tus gastos mensuales
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
