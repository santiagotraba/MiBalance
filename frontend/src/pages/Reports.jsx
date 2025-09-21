import React, { useState, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { analyticsService } from "../services/analyticsService";
import LoadingSpinner from "../components/LoadingSpinner";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getAnalytics(timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error("Error cargando analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!analytics) return <div>No hay datos disponibles</div>;

  // Configuración de gráficos
  const expenseChartData = {
    labels: analytics.expenseByCategory.map((item) => item.category),
    datasets: [
      {
        data: analytics.expenseByCategory.map((item) => item.amount),
        backgroundColor: analytics.expenseByCategory.map((item) => item.color),
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const incomeChartData = {
    labels: analytics.incomeByCategory.map((item) => item.category),
    datasets: [
      {
        data: analytics.incomeByCategory.map((item) => item.amount),
        backgroundColor: analytics.incomeByCategory.map((item) => item.color),
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const monthlyTrendData = {
    labels: analytics.monthlyTrend.map((item) => item.month),
    datasets: [
      {
        label: "Ingresos",
        data: analytics.monthlyTrend.map((item) => item.income),
        borderColor: "#10B981",
        backgroundColor: "#10B98120",
        tension: 0.4,
      },
      {
        label: "Gastos",
        data: analytics.monthlyTrend.map((item) => item.expense),
        borderColor: "#EF4444",
        backgroundColor: "#EF444420",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="90">Últimos 90 días</option>
          <option value="365">Último año</option>
        </select>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Total Ingresos
          </h3>
          <p className="text-2xl font-bold text-green-600">
            ${analytics.totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Total Gastos
          </h3>
          <p className="text-2xl font-bold text-red-600">
            ${analytics.totalExpense.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Balance</h3>
          <p
            className={`text-2xl font-bold ${
              analytics.balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${analytics.balance.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Ahorro</h3>
          <p className="text-2xl font-bold text-blue-600">
            {analytics.savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gastos por categoría */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Gastos por Categoría
          </h3>
          <div className="h-64">
            <Doughnut data={expenseChartData} options={chartOptions} />
          </div>
        </div>

        {/* Ingresos por categoría */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ingresos por Categoría
          </h3>
          <div className="h-64">
            <Doughnut data={incomeChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Tendencia mensual */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tendencia Mensual
        </h3>
        <div className="h-64">
          <Line data={monthlyTrendData} options={chartOptions} />
        </div>
      </div>

      {/* Top categorías */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Gastos
          </h3>
          <div className="space-y-3">
            {analytics.topExpenses.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.category}</span>
                </div>
                <span className="text-sm font-bold text-red-600">
                  ${item.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Ingresos
          </h3>
          <div className="space-y-3">
            {analytics.topIncomes.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.category}</span>
                </div>
                <span className="text-sm font-bold text-green-600">
                  ${item.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
