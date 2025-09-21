import { Link } from "react-router-dom";
import {
  formatCurrency,
  formatDate,
  getTransactionTypeColor,
  getTransactionTypeBgColor,
} from "../utils/formatters";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const RecentTransactions = ({ transactions = [] }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay transacciones recientes</p>
        <Link
          to="/transactions"
          className="text-primary-600 hover:text-primary-500 text-sm font-medium"
        >
          Agregar primera transacción
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-full ${getTransactionTypeBgColor(
                transaction.type
              )}`}
            >
              {transaction.type === "INCOME" ? (
                <ArrowUpRight
                  className={`h-4 w-4 ${getTransactionTypeColor(
                    transaction.type
                  )}`}
                />
              ) : (
                <ArrowDownRight
                  className={`h-4 w-4 ${getTransactionTypeColor(
                    transaction.type
                  )}`}
                />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {transaction.description || "Sin descripción"}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{formatDate(transaction.date)}</span>
                {transaction.category && (
                  <>
                    <span>•</span>
                    <span
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: transaction.category.color + "20",
                        color: transaction.category.color,
                      }}
                    >
                      {transaction.category.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`text-sm font-semibold ${getTransactionTypeColor(
                transaction.type
              )}`}
            >
              {transaction.type === "INCOME" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>
          </div>
        </div>
      ))}

      <div className="pt-3 border-t border-gray-200">
        <Link
          to="/transactions"
          className="text-primary-600 hover:text-primary-500 text-sm font-medium"
        >
          Ver todas las transacciones →
        </Link>
      </div>
    </div>
  );
};

export default RecentTransactions;
