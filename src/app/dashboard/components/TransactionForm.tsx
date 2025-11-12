'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Camera, Upload, X, Loader2, Sparkles } from 'lucide-react';
import type { Transaction, TransactionType, TransactionCategory } from '@/lib/types';
import { getCategoryIcon } from '@/lib/financial-utils';
import { toast } from 'sonner';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  defaultSection?: 'products' | 'salaries' | 'taxes' | 'general';
  showSectionSelector?: boolean;
  currency?: string;
}

export function TransactionForm({ onAddTransaction, defaultSection = 'general', showSectionSelector = false, currency = '€' }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('income');
  const [category, setCategory] = useState<TransactionCategory>('salary');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDay, setRecurringDay] = useState('1');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [section, setSection] = useState<'products' | 'salaries' | 'taxes' | 'general'>(defaultSection);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description) return;

    const transaction: Omit<Transaction, 'id'> = {
      type: isRecurring ? (type === 'income' ? 'recurring_income' : 'recurring_expense') : type,
      category,
      amount: parseFloat(amount),
      description,
      date: new Date(date),
      isRecurring,
      recurringDay: isRecurring ? parseInt(recurringDay) : undefined,
      receiptImage: receiptImage || undefined,
      section: showSectionSelector ? section : defaultSection,
    };

    onAddTransaction(transaction);

    // Reset form
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setReceiptImage(null);
    toast.success('Transação adicionada com sucesso!');
  };

  const analyzeReceipt = async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error('Erro ao analisar comprovativo');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        // Preenche automaticamente os campos
        setAmount(result.data.amount.toString());
        setDescription(result.data.description + (result.data.merchant ? ` - ${result.data.merchant}` : ''));
        if (result.data.date) {
          setDate(result.data.date);
        }
        if (result.data.category) {
          setCategory(result.data.category);
        }
        
        toast.success('✨ Comprovativo analisado com sucesso!', {
          description: `Valor detectado: €${result.data.amount.toFixed(2)}`,
        });
      }
    } catch (error) {
      console.error('Erro ao analisar:', error);
      toast.error('Erro ao analisar comprovativo', {
        description: 'Por favor, preencha os dados manualmente.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande', {
        description: 'Por favor, selecione uma imagem menor que 5MB',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageData = event.target?.result as string;
      setReceiptImage(imageData);
      
      // Analisa automaticamente
      await analyzeReceipt(imageData);
    };
    reader.readAsDataURL(file);
  };

  const removeReceipt = () => {
    setReceiptImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const incomeCategories: TransactionCategory[] = ['salary', 'sales', 'services', 'investment', 'product_income'];
  const expenseCategories: TransactionCategory[] = ['rent', 'utilities', 'food', 'transport', 'vehicle', 'supplies', 'marketing', 'employee_salary', 'tax', 'product_expense', 'other'];

  const categories = type === 'income' || type === 'recurring_income' 
    ? incomeCategories 
    : expenseCategories;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nova Transação
        </CardTitle>
        <CardDescription>
          Adicione receitas ou despesas ao seu controlo financeiro
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Seção de Upload de Comprovativo */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Comprovativo (Análise Automática com IA)
            </Label>
            
            {!receiptImage ? (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-24 border-dashed border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 text-blue-500" />
                    <span className="text-sm">Anexar Ficheiro</span>
                  </div>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-24 border-dashed border-2 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950 transition-all"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="w-6 h-6 text-purple-500" />
                    <span className="text-sm">Tirar Foto</span>
                  </div>
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="relative">
                <div className="relative rounded-lg overflow-hidden border-2 border-green-500 bg-green-50 dark:bg-green-950 p-2">
                  <img
                    src={receiptImage}
                    alt="Comprovativo"
                    className="w-full h-48 object-contain rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={removeReceipt}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                      <span className="text-sm font-medium">Analisando comprovativo...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              📸 Tire uma foto ou anexe um comprovativo. A IA irá extrair automaticamente o valor e descrição!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={type} onValueChange={(value) => setType(value as TransactionType)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">💰 Receita</SelectItem>
                  <SelectItem value="expense">💸 Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as TransactionCategory)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {showSectionSelector && (
            <div className="space-y-2">
              <Label htmlFor="section">Seção</Label>
              <Select value={section} onValueChange={(value) => setSection(value as any)}>
                <SelectTrigger id="section">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">📊 Geral</SelectItem>
                  <SelectItem value="products">📦 Produtos</SelectItem>
                  <SelectItem value="salaries">👥 Salários</SelectItem>
                  <SelectItem value="taxes">📄 Impostos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor ({currency})</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className={receiptImage && amount ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Ex: Pagamento de salário, Compra de material..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={2}
              className={receiptImage && description ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="recurring" className="text-base">
                Transação recorrente
              </Label>
              <p className="text-sm text-muted-foreground">
                Repetir automaticamente todos os meses
              </p>
            </div>
            <Switch
              id="recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
          </div>

          {isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="recurringDay">Dia do mês</Label>
              <Select value={recurringDay} onValueChange={setRecurringDay}>
                <SelectTrigger id="recurringDay">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      Dia {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Transação
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
