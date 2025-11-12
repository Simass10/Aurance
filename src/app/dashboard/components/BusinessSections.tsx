'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Package, Users, FileText, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { formatCurrency } from '@/lib/financial-utils';

interface BusinessSectionsProps {
  transactions: Transaction[];
  onAddTransaction: (section: 'products' | 'salaries' | 'taxes') => void;
}

export function BusinessSections({ transactions, onAddTransaction }: BusinessSectionsProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'salaries' | 'taxes'>('products');

  // Filtrar transações por seção
  const productTransactions = transactions.filter(t => t.section === 'products');
  const salaryTransactions = transactions.filter(t => t.section === 'salaries');
  const taxTransactions = transactions.filter(t => t.section === 'taxes');

  // Calcular totais por seção
  const calculateSectionStats = (sectionTransactions: Transaction[]) => {
    const income = sectionTransactions
      .filter(t => t.type === 'income' || t.type === 'recurring_income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = sectionTransactions
      .filter(t => t.type === 'expense' || t.type === 'recurring_expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { income, expenses, balance: income - expenses };
  };

  const productStats = calculateSectionStats(productTransactions);
  const salaryStats = calculateSectionStats(salaryTransactions);
  const taxStats = calculateSectionStats(taxTransactions);

  const SectionCard = ({ 
    title, 
    icon: Icon, 
    stats, 
    transactions, 
    color,
    section 
  }: { 
    title: string; 
    icon: any; 
    stats: { income: number; expenses: number; balance: number };
    transactions: Transaction[];
    color: string;
    section: 'products' | 'salaries' | 'taxes';
  }) => (
    <Card className="overflow-hidden">
      <CardHeader className={`bg-gradient-to-r ${color} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription className="text-white/80">
                {transactions.length} transações
              </CardDescription>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-0"
            onClick={() => onAddTransaction(section)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Receitas</span>
            </div>
            <p className="text-lg font-bold text-green-700 dark:text-green-300">
              {formatCurrency(stats.income)}
            </p>
          </div>

          <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-medium">Despesas</span>
            </div>
            <p className="text-lg font-bold text-red-700 dark:text-red-300">
              {formatCurrency(stats.expenses)}
            </p>
          </div>

          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-1">
              <span className="text-xs font-medium">Saldo</span>
            </div>
            <p className={`text-lg font-bold ${stats.balance >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}`}>
              {formatCurrency(stats.balance)}
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">Transações Recentes</h4>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Nenhuma transação nesta seção</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => onAddTransaction(section)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar primeira transação
              </Button>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <div className={`text-right ${
                    transaction.type === 'income' || transaction.type === 'recurring_income'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    <p className="font-bold">
                      {transaction.type === 'income' || transaction.type === 'recurring_income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Seções Empresariais</h2>
          <p className="text-muted-foreground">Analise cada área do seu negócio separadamente</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="products" className="flex items-center gap-2 py-3">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Produtos</span>
          </TabsTrigger>
          <TabsTrigger value="salaries" className="flex items-center gap-2 py-3">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Salários</span>
          </TabsTrigger>
          <TabsTrigger value="taxes" className="flex items-center gap-2 py-3">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Impostos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <SectionCard
            title="Produtos"
            icon={Package}
            stats={productStats}
            transactions={productTransactions}
            color="from-violet-500 to-violet-600"
            section="products"
          />
        </TabsContent>

        <TabsContent value="salaries" className="space-y-4">
          <SectionCard
            title="Salários"
            icon={Users}
            stats={salaryStats}
            transactions={salaryTransactions}
            color="from-indigo-500 to-indigo-600"
            section="salaries"
          />
        </TabsContent>

        <TabsContent value="taxes" className="space-y-4">
          <SectionCard
            title="Despesas Fiscais"
            icon={FileText}
            stats={taxStats}
            transactions={taxTransactions}
            color="from-blue-500 to-blue-600"
            section="taxes"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
