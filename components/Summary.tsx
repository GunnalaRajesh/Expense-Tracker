
import React from 'react';
import { IncomeIcon, ExpenseIcon } from './icons';

interface SummaryProps {
  totalIncome: number;
  totalExpenses: number;
}

const SummaryCard: React.FC<{ title: string, amount: number, color: 'green' | 'red' | 'blue' }> = ({ title, amount, color }) => {
    const colorClasses = {
        green: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400',
        red: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400',
        blue: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400',
    };
    
    const borderColor = {
        green: 'border-green-200 dark:border-green-700',
        red: 'border-red-200 dark:border-red-700',
        blue: 'border-indigo-200 dark:border-indigo-700',
    }
    
  return (
    <div className={`bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-md border ${borderColor[color]} flex flex-col justify-between`}>
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${colorClasses[color]}`}>
        ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
};

const Summary: React.FC<SummaryProps> = ({ totalIncome, totalExpenses }) => {
  const balance = totalIncome - totalExpenses;
  const balanceColor = balance >= 0 ? 'blue' : 'red';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard title="Total Income" amount={totalIncome} color="green" />
      <SummaryCard title="Total Expenses" amount={totalExpenses} color="red" />
      <SummaryCard title="Balance" amount={balance} color={balanceColor} />
    </div>
  );
};

export default Summary;
