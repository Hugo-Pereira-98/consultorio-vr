'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/card';
import { Badge } from '@/components/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Calendar } from '@/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover';
import { Separator } from '@/components/separator';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  FiCalendar,
  FiFilter,
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiDollarSign,
  FiPieChart,
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from 'recharts';

interface Transaction {
  id: number;
  date: Date;
  type: string;
  description: string;
  value: number;
  category: 'revenue' | 'expense';
  color: string;
}

// Base data for transaction generation
const baseData = {
  revenues: [
    {
      base: 1500,
      variance: 300,
      type: 'Consultas Particulares',
      color: '#0ea5e9',
    },
    { base: 2000, variance: 400, type: 'Convênios', color: '#10b981' },
    {
      base: 2500,
      variance: 500,
      type: 'Procedimentos Estéticos',
      color: '#8b5cf6',
    },
    { base: 3000, variance: 600, type: 'Ortodontia', color: '#f59e0b' },
  ],
  expenses: [
    {
      base: 800,
      variance: 200,
      type: 'Material Odontológico',
      color: '#ef4444',
    },
    { base: 1200, variance: 300, type: 'Salários', color: '#ec4899' },
    { base: 1000, variance: 200, type: 'Aluguel', color: '#6366f1' },
    { base: 1500, variance: 400, type: 'Equipamentos', color: '#14b8a6' },
    { base: 500, variance: 100, type: 'Marketing', color: '#f97316' },
    { base: 700, variance: 150, type: 'Utilidades', color: '#84cc16' },
  ],
};

const generateFinancialData = (count: number): Transaction[] => {
  return Array.from({ length: count }, (_, index) => {
    const isRevenue = index % 2 === 0;
    const categories = isRevenue ? baseData.revenues : baseData.expenses;
    const category = categories[index % categories.length];

    const date = new Date();
    date.setMonth(date.getMonth() - (index % 6));
    date.setDate(1 + (index % 28));

    const value = category.base + (index % category.variance);

    return {
      id: index + 1,
      date,
      type: category.type,
      description: `${category.type} - ${format(date, 'dd/MM/yyyy', {
        locale: ptBR,
      })}`,
      value: isRevenue ? value : -value,
      category: isRevenue ? 'revenue' : 'expense',
      color: category.color,
    };
  });
};

export default function Financeiro() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions(generateFinancialData(200));
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || transaction.category === selectedCategory;
      const matchesDateRange =
        (!dateRange?.from || transaction.date >= dateRange.from) &&
        (!dateRange?.to || transaction.date <= dateRange.to);

      return matchesSearch && matchesCategory && matchesDateRange;
    });
  }, [transactions, searchTerm, selectedCategory, dateRange]);

  const summary = useMemo(() => {
    const revenues = filteredTransactions.filter((t) => t.value > 0);
    const expenses = filteredTransactions.filter((t) => t.value < 0);

    return {
      totalRevenue: revenues.reduce((sum, t) => sum + t.value, 0),
      totalExpense: Math.abs(expenses.reduce((sum, t) => sum + t.value, 0)),
      balance: filteredTransactions.reduce((sum, t) => sum + t.value, 0),
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  const chartData = useMemo(() => {
    const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
      const key = transaction.type;
      if (!acc[key]) {
        acc[key] = {
          name: key,
          value: Math.abs(transaction.value),
          color: transaction.color,
        };
      } else {
        acc[key].value += Math.abs(transaction.value);
      }
      return acc;
    }, {} as Record<string, { name: string; value: number; color: string }>);

    return Object.values(categoryTotals);
  }, [filteredTransactions]);

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiArrowUpCircle className="text-green-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Receitas</span>
          </div>
          <p className="text-2xl font-bold mt-2 text-green-600">
            R$ {summary.totalRevenue.toLocaleString('pt-BR')}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiArrowDownCircle className="text-red-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Despesas</span>
          </div>
          <p className="text-2xl font-bold mt-2 text-red-600">
            R$ {summary.totalExpense.toLocaleString('pt-BR')}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiDollarSign className="text-blue-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Saldo</span>
          </div>
          <p
            className={`text-2xl font-bold mt-2 ${
              summary.balance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            R$ {summary.balance.toLocaleString('pt-BR')}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiPieChart className="text-purple-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Transações</span>
          </div>
          <p className="text-2xl font-bold mt-2">{summary.transactionCount}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart Card */}
        <Card className="md:col-span-2 p-6 h-[400px]">
          <h3 className="text-lg font-semibold mb-4">
            Distribuição por Categoria
          </h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `R$ ${value.toLocaleString('pt-BR')}`
                  }
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    bottom: 0,
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Filters Card */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Filtros</h3>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  <FiFilter className="mr-2 h-4 w-4" />
                  {selectedCategory === 'revenue'
                    ? 'Receitas'
                    : selectedCategory === 'expense'
                    ? 'Despesas'
                    : 'Todas Transações'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuCheckboxItem
                  checked={!selectedCategory}
                  onCheckedChange={() => setSelectedCategory(null)}
                >
                  Todas Transações
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedCategory === 'revenue'}
                  onCheckedChange={() => setSelectedCategory('revenue')}
                >
                  Receitas
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedCategory === 'expense'}
                  onCheckedChange={() => setSelectedCategory('expense')}
                >
                  Despesas
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  <FiCalendar className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange?.to ? (
                      <>
                        {format(dateRange.from, 'dd/MM/yy', { locale: ptBR })} -{' '}
                        {format(dateRange.to, 'dd/MM/yy', { locale: ptBR })}
                      </>
                    ) : (
                      format(dateRange.from, 'dd/MM/yy', { locale: ptBR })
                    )
                  ) : (
                    'Selecionar período'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from || new Date()}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(transaction.date, 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.type}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.category === 'revenue'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {transaction.category === 'revenue' ? 'Receita' : 'Despesa'}
                  </Badge>
                </TableCell>
                <TableCell
                  className={
                    transaction.value >= 0 ? 'text-green-600' : 'text-red-600'
                  }
                >
                  R$ {Math.abs(transaction.value).toLocaleString('pt-BR')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
