
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { TrashIcon, IncomeIcon, ExpenseIcon } from './icons';

interface TransactionListProps {
  transactions: Transaction[];
  deleteTransaction: (id: string) => void;
}

const TransactionItem: React.FC<{ transaction: Transaction; onDelete: (id: string) => void }> = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === TransactionType.INCOME;
  const amountColor = isIncome ? 'text-green-500' : 'text-red-500';
  const Icon = isIncome ? IncomeIcon : ExpenseIcon;
  const iconBgColor = isIncome ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50';

  return (
    <li className="flex items-center justify-between p-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${iconBgColor} ${amountColor}`}>
            <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{transaction.description}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{transaction.category} &bull; {new Date(transaction.date + 'T00:00:00').toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`font-bold ${amountColor}`}>
          {isIncome ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </span>
        <button onClick={() => onDelete(transaction.id)} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, deleteTransaction }) => {
  if (transactions.length === 0) {
    return (
       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md h-full flex items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400">No transactions for this month.</p>
      </div>
    );
  }
  
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 px-3">Recent Transactions</h3>
      <ul className="divide-y divide-slate-200 dark:divide-slate-700 max-h-[350px] overflow-y-auto">
        {sortedTransactions.map((tx) => (
          <TransactionItem key={tx.id} transaction={tx} onDelete={deleteTransaction} />
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
