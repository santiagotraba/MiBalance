import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Target, Plus, Calendar, DollarSign } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/formatters";
import { savingsGoalService } from "../services/savingsGoalService";
import LoadingSpinner from "./LoadingSpinner";

const SavingsGoals = ({ showAll = true }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        setLoading(true);
        const response = await savingsGoalService.getGoals();
        const goals = response.data?.goals || [];
        setGoals(showAll ? goals : goals.slice(0, 3));
      } catch (error) {
        console.error("Error loading savings goals:", error);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, [showAll]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <LoadingSpinner />
      </div>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <div className="text-center py-8">
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">
          No tienes metas de ahorro configuradas
        </p>
        <Link to="/savings-goals" className="btn btn-primary btn-sm">
          <Plus className="h-4 w-4 mr-2" />
          Crear primera meta
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div key={goal.id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{goal.name}</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {formatCurrency(goal.currentAmount)} /{" "}
                  {formatCurrency(goal.targetAmount)}
                </div>
                {goal.targetDate && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(goal.targetDate)}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                {formatCurrency(goal.targetAmount - goal.currentAmount)}{" "}
                restantes
              </div>
              <div className="text-xs text-gray-500">
                {goal.progress?.toFixed(1)}% completado
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                goal.isAchieved ? "bg-success-500" : "bg-primary-500"
              }`}
              style={{ width: `${Math.min(goal.progress || 0, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {goal.isAchieved
                ? "¡Meta alcanzada!"
                : `${goal.daysRemaining} días restantes`}
            </span>
            {goal.isOverdue && !goal.isAchieved && (
              <span className="text-danger-600 font-medium">Vencida</span>
            )}
          </div>
        </div>
      ))}

      {!showAll && goals.length >= 3 && (
        <div className="pt-3 border-t border-gray-200">
          <Link
            to="/savings-goals"
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            Ver todas las metas →
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavingsGoals;
