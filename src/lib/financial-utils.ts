import { Transaction, MonthlyData, TransactionCategory } from './types';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { pt } from 'date-fns/locale';

export function calculateMonthlyStats(transactions: Transaction[]) {
  const income = transactions
    .filter(t => t.type === 'income' || t.type === 'recurring_income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense' || t.type === 'recurring_expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expenses,
    profit: income - expenses,
  };
}

export function getMonthlyChartData(transactions: Transaction[], months: number = 6): MonthlyData[] {
  const now = new Date();
  const startDate = subMonths(now, months - 1);
  const monthsArray = eachMonthOfInterval({ start: startDate, end: now });

  return monthsArray.map(monthDate => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income' || t.type === 'recurring_income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense' || t.type === 'recurring_expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: format(monthDate, 'MMM', { locale: pt }),
      income,
      expenses,
      profit: income - expenses,
    };
  });
}

export function getCategoryIcon(category: TransactionCategory): string {
  const icons: Record<TransactionCategory, string> = {
    salary: '💰',
    sales: '🛒',
    services: '🔧',
    investment: '📈',
    rent: '🏠',
    utilities: '💡',
    food: '🍽️',
    transport: '🚗',
    vehicle: '🚙',
    supplies: '📦',
    marketing: '📢',
    other: '📝',
  };
  return icons[category] || '📝';
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}
