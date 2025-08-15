
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction, TransactionType, Category } from '../types';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943', '#19D1FF', '#FF6B19'];

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg">
        <p className="label text-slate-800 dark:text-slate-100">{`${payload[0].name} : $${payload[0].value.toFixed(2)} (${(payload[0].payload.percent * 100).toFixed(0)}%)`}</p>
      </div>
    );
  }
  return null;
};


const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  const expenseData = useMemo(() => {
    const expenseByCategory = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
      }, {} as Record<Category, number>);

    return Object.entries(expenseByCategory).map(([name, value]) => ({
      name,
      value,
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);
  
  if (expenseData.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md h-full flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">No expense data for this month to display chart.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md h-[400px]">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 pl-4">Expense Breakdown</h3>
        <ResponsiveContainer width="100%" height="90%">
            <PieChart>
                <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                >
                    {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
