// Tipos da aplicação financeira

export type UserProfile = 'personal' | 'commerce' | 'business';

export interface QuizAnswer {
  profile: UserProfile;
  name?: string; // Nome da pessoa ou empresa
  email?: string;
  nationality?: string; // País de origem
  currency?: string; // Moeda local (automática baseada no país)
  origin?: string; // Cidade/região de origem
  monthlyIncome?: number;
  hasEmployees?: boolean;
  businessType?: string;
  profileImage?: string; // Foto de perfil ou logo
  brandColors?: {
    primary: string;
    secondary: string;
  };
}

export type TransactionType = 
  | 'income' 
  | 'expense' 
  | 'recurring_income' 
  | 'recurring_expense';

export type TransactionCategory = 
  | 'salary'
  | 'sales'
  | 'services'
  | 'investment'
  | 'rent'
  | 'utilities'
  | 'food'
  | 'transport'
  | 'vehicle'
  | 'supplies'
  | 'marketing'
  | 'employee_salary'
  | 'tax'
  | 'product_expense'
  | 'product_income'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: Date;
  isRecurring?: boolean;
  recurringDay?: number;
  receiptImage?: string; // URL ou base64 da imagem do comprovativo
  section?: 'products' | 'salaries' | 'taxes' | 'general'; // Seção para empresas
}

export interface FinancialData {
  profile: QuizAnswer;
  transactions: Transaction[];
  monthlyStats: {
    income: number;
    expenses: number;
    profit: number;
  };
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  profit: number;
}

export interface ReceiptAnalysis {
  amount: number;
  description: string;
  category?: TransactionCategory;
  date?: string;
  merchant?: string;
}

// Seções empresariais
export interface BusinessSection {
  id: string;
  name: string;
  type: 'products' | 'salaries' | 'taxes';
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

// Mapeamento de países para moedas
export const COUNTRY_CURRENCY_MAP: Record<string, { currency: string; symbol: string }> = {
  'Portugal': { currency: 'EUR', symbol: '€' },
  'Brasil': { currency: 'BRL', symbol: 'R$' },
  'Espanha': { currency: 'EUR', symbol: '€' },
  'França': { currency: 'EUR', symbol: '€' },
  'Alemanha': { currency: 'EUR', symbol: '€' },
  'Itália': { currency: 'EUR', symbol: '€' },
  'Reino Unido': { currency: 'GBP', symbol: '£' },
  'Estados Unidos': { currency: 'USD', symbol: '$' },
  'Canadá': { currency: 'CAD', symbol: 'CA$' },
  'Austrália': { currency: 'AUD', symbol: 'A$' },
  'Suíça': { currency: 'CHF', symbol: 'CHF' },
  'Japão': { currency: 'JPY', symbol: '¥' },
  'China': { currency: 'CNY', symbol: '¥' },
  'Índia': { currency: 'INR', symbol: '₹' },
  'México': { currency: 'MXN', symbol: 'MX$' },
  'Argentina': { currency: 'ARS', symbol: 'AR$' },
  'Angola': { currency: 'AOA', symbol: 'Kz' },
  'Moçambique': { currency: 'MZN', symbol: 'MT' },
  'Cabo Verde': { currency: 'CVE', symbol: '$' },
};
