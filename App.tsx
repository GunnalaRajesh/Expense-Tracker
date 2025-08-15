
import React, { useState, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionType } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Summary from './components/Summary';
import ExpenseChart from './components/ExpenseChart';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from './components/icons';

const App: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [...prev, { ...transaction, id: uuidv4() }]);
  }, [setTransactions]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, [setTransactions]);

  const changeMonth = (offset: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const monthlyTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date + 'T00:00:00');
      return transactionDate.getFullYear() === currentDate.getFullYear() &&
             transactionDate.getMonth() === currentDate.getMonth();
    });
  }, [transactions, currentDate]);

  const { totalIncome, totalExpenses } = useMemo(() => {
    return monthlyTransactions.reduce(
      (acc, t) => {
        if (t.type === TransactionType.INCOME) {
          acc.totalIncome += t.amount;
        } else {
          acc.totalExpenses += t.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0 }
    );
  }, [monthlyTransactions]);

  const formattedMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Financial Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, track your financial health.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0 flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200"
          >
            <PlusIcon className="w-5 h-5" />
            Add Transaction
          </button>
        </header>

        <main className="space-y-8">
          <div className="flex justify-center items-center gap-4 mb-6">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-center w-48">{formattedMonth}</h2>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <ArrowRightIcon className="w-6 h-6" />
            </button>
          </div>

          <Summary totalIncome={totalIncome} totalExpenses={totalExpenses} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ExpenseChart transactions={monthlyTransactions} />
            <TransactionList transactions={monthlyTransactions} deleteTransaction={deleteTransaction} />
          </div>
        </main>

        <TransactionForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          addTransaction={addTransaction}
        />
      </div>
    </div>
  );
};

export default App;
