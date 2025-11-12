'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Receipt, TrendingUp, TrendingDown, Calendar, Repeat, Image as ImageIcon } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { getCategoryIcon } from '@/lib/financial-utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getTypeIcon = (type: Transaction['type']) => {
    if (type === 'income' || type === 'recurring_income') {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    }
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getTypeColor = (type: Transaction['type']) => {
    if (type === 'income' || type === 'recurring_income') {
      return 'text-green-600 dark:text-green-400';
    }
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Histórico de Transações
          </CardTitle>
          <CardDescription>
            Todas as suas receitas e despesas registadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {sortedTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Receipt className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Ainda não há transações registadas
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Adicione a sua primeira transação acima
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {getTypeIcon(transaction.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1">
                          <p className="font-medium truncate">
                            {transaction.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {getCategoryIcon(transaction.category)} {transaction.category}
                            </Badge>
                            {transaction.isRecurring && (
                              <Badge variant="secondary" className="text-xs">
                                <Repeat className="w-3 h-3 mr-1" />
                                Recorrente
                              </Badge>
                            )}
                            {transaction.receiptImage && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => setSelectedReceipt(transaction.receiptImage || null)}
                              >
                                <ImageIcon className="w-3 h-3 mr-1" />
                                Ver comprovativo
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className={`font-bold text-lg whitespace-nowrap ${getTypeColor(transaction.type)}`}>
                          {transaction.type === 'income' || transaction.type === 'recurring_income' ? '+' : '-'}
                          €{transaction.amount.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(transaction.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Dialog para visualizar comprovativo */}
      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Comprovativo da Transação</DialogTitle>
            <DialogDescription>
              Imagem anexada ao registo da transação
            </DialogDescription>
          </DialogHeader>
          {selectedReceipt && (
            <div className="mt-4">
              <img
                src={selectedReceipt}
                alt="Comprovativo"
                className="w-full h-auto rounded-lg border"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
