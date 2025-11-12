'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, TrendingUp, Building2, LayoutDashboard, Package } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCards } from './components/StatsCards';
import { FinancialChart } from './components/FinancialChart';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { BusinessSections } from './components/BusinessSections';
import { AuranceLogo } from '@/components/custom/AuranceLogo';
import type { Transaction, QuizAnswer } from '@/lib/types';
import { calculateMonthlyStats, getMonthlyChartData } from '@/lib/financial-utils';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<QuizAnswer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSection, setSelectedSection] = useState<'products' | 'salaries' | 'taxes' | 'general'>('general');

  useEffect(() => {
    // Carregar perfil do localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (!savedProfile) {
      router.push('/');
      return;
    }
    setProfile(JSON.parse(savedProfile));

    // Carregar transações do localStorage
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      // Dados de exemplo para demonstração
      const exampleTransactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          category: 'salary',
          amount: 2500,
          description: 'Salário mensal',
          date: new Date('2024-01-15'),
          section: 'general',
        },
        {
          id: '2',
          type: 'expense',
          category: 'rent',
          amount: 800,
          description: 'Renda do apartamento',
          date: new Date('2024-01-05'),
          section: 'general',
        },
        {
          id: '3',
          type: 'expense',
          category: 'food',
          amount: 350,
          description: 'Compras do mês',
          date: new Date('2024-01-10'),
          section: 'general',
        },
      ];
      setTransactions(exampleTransactions);
      localStorage.setItem('transactions', JSON.stringify(exampleTransactions));
    }
  }, [router]);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userProfile');
      localStorage.removeItem('transactions');
      window.location.href = '/';
    }
  };

  const handleAddSectionTransaction = (section: 'products' | 'salaries' | 'taxes') => {
    setSelectedSection(section);
    setActiveTab('overview');
    // Scroll to form
    setTimeout(() => {
      document.getElementById('transaction-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (!profile) {
    return null;
  }

  const stats = calculateMonthlyStats(transactions);
  const chartData = getMonthlyChartData(transactions);

  const getProfileIcon = () => {
    switch (profile.profile) {
      case 'personal':
        return <User className="w-5 h-5" />;
      case 'commerce':
        return <TrendingUp className="w-5 h-5" />;
      case 'business':
        return <Building2 className="w-5 h-5" />;
    }
  };

  const getProfileLabel = () => {
    switch (profile.profile) {
      case 'personal':
        return 'Pessoal';
      case 'commerce':
        return 'Comércio';
      case 'business':
        return 'Empresa';
    }
  };

  const isBusinessProfile = profile.profile === 'commerce' || profile.profile === 'business';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header - Estilo Revolut com Logo Aurance */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo Aurance */}
              <AuranceLogo size="sm" showText={false} />
              
              {/* Profile Info */}
              <div className="flex items-center gap-3">
                {profile.profileImage ? (
                  <Avatar className="w-10 h-10 border-2 border-violet-500">
                    <AvatarImage src={profile.profileImage} alt="Profile" />
                    <AvatarFallback>{profile.name?.[0] || getProfileLabel()[0]}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    {getProfileIcon()}
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-bold">{profile.name || 'Dashboard'}</h1>
                  <p className="text-xs text-muted-foreground">
                    {getProfileLabel()}
                    {profile.businessType && ` • ${profile.businessType}`}
                    {profile.origin && ` • ${profile.origin}`}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Moeda */}
              {profile.currency && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-violet-50 dark:bg-violet-950 rounded-full">
                  <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                    {profile.currency}
                  </span>
                </div>
              )}
              
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className={`grid w-full ${isBusinessProfile ? 'grid-cols-2' : 'grid-cols-1'} max-w-md mx-auto h-auto p-1`}>
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
              <LayoutDashboard className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            {isBusinessProfile && (
              <TabsTrigger value="sections" className="flex items-center gap-2 py-3">
                <Package className="w-4 h-4" />
                Seções
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <StatsCards
              income={stats.income}
              expenses={stats.expenses}
              profit={stats.profit}
              currency={profile.currency}
            />

            {/* Charts */}
            <FinancialChart data={chartData} currency={profile.currency} />

            {/* Transaction Form and List */}
            <div className="grid gap-8 lg:grid-cols-2">
              <div id="transaction-form">
                <TransactionForm 
                  onAddTransaction={handleAddTransaction}
                  defaultSection={selectedSection}
                  showSectionSelector={isBusinessProfile}
                  currency={profile.currency}
                />
              </div>
              <TransactionList
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
                currency={profile.currency}
              />
            </div>
          </TabsContent>

          {isBusinessProfile && (
            <TabsContent value="sections" className="space-y-8">
              <BusinessSections
                transactions={transactions}
                onAddTransaction={handleAddSectionTransaction}
                currency={profile.currency}
              />
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Footer com Logo Aurance */}
      <footer className="border-t mt-16 py-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <AuranceLogo size="sm" />
          </div>
          <p className="text-sm text-muted-foreground">
            Controlo Financeiro Inteligente - Organize as suas finanças de forma simples e eficiente
          </p>
        </div>
      </footer>
    </div>
  );
}
