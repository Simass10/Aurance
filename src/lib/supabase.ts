import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          profile_type: 'personal' | 'commerce' | 'business';
          name: string;
          email: string;
          nationality: string;
          currency: string;
          origin: string;
          monthly_income: number | null;
          has_employees: boolean | null;
          business_type: string | null;
          profile_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          profile_type: 'personal' | 'commerce' | 'business';
          name: string;
          email: string;
          nationality: string;
          currency: string;
          origin: string;
          monthly_income?: number | null;
          has_employees?: boolean | null;
          business_type?: string | null;
          profile_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          profile_type?: 'personal' | 'commerce' | 'business';
          name?: string;
          email?: string;
          nationality?: string;
          currency?: string;
          origin?: string;
          monthly_income?: number | null;
          has_employees?: boolean | null;
          business_type?: string | null;
          profile_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'income' | 'expense' | 'recurring_income' | 'recurring_expense';
          category: string;
          amount: number;
          description: string;
          date: string;
          is_recurring: boolean;
          recurring_day: number | null;
          receipt_image: string | null;
          section: 'products' | 'salaries' | 'taxes' | 'general';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'income' | 'expense' | 'recurring_income' | 'recurring_expense';
          category: string;
          amount: number;
          description: string;
          date: string;
          is_recurring?: boolean;
          recurring_day?: number | null;
          receipt_image?: string | null;
          section?: 'products' | 'salaries' | 'taxes' | 'general';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'income' | 'expense' | 'recurring_income' | 'recurring_expense';
          category?: string;
          amount?: number;
          description?: string;
          date?: string;
          is_recurring?: boolean;
          recurring_day?: number | null;
          receipt_image?: string | null;
          section?: 'products' | 'salaries' | 'taxes' | 'general';
          created_at?: string;
        };
      };
    };
  };
}
