'use client';

import { Badge } from '@/components/badge';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import { Progress } from '@/components/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';
import {
  FiAlertCircle,
  FiBox,
  FiPackage,
  FiShoppingCart,
} from 'react-icons/fi';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface StockItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  lastRestockDate: Date;
  expiryDate: Date | null;
  supplier: string;
  status: 'ok' | 'low' | 'critical';
  unit: string;
}

const categories = [
  'Materiais de Restauração',
  'Instrumentos',
  'Anestésicos',
  'Materiais Descartáveis',
  'Equipamentos de Proteção',
  'Materiais de Impressão',
  'Ortodontia',
  'Implantes',
  'Esterilização',
];

const suppliers = [
  'Dental Brasil',
  'OdontoPro',
  'Medical Supplies',
  'DentalCorp',
  'TechDental',
];

const units = ['unidade(s)', 'caixa(s)', 'pacote(s)', 'kit(s)', 'ml', 'g'];

// Adjust the initial items to include all required properties
const generateStockData = (): StockItem[] => {
  const currentDate = new Date();

  const items: StockItem[] = [
    {
      id: 1,
      name: 'Resina Composta Z350',
      category: 'Materiais de Restauração',
      quantity: 15,
      minQuantity: 10,
      price: 120.5,
      lastRestockDate: currentDate,
      expiryDate: new Date(currentDate.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      supplier: 'Dental Brasil',
      status: 'ok',
      unit: 'unidade(s)',
    },
    {
      id: 2,
      name: 'Luvas de Procedimento',
      category: 'Equipamentos de Proteção',
      quantity: 5,
      minQuantity: 20,
      price: 45.9,
      lastRestockDate: currentDate,
      expiryDate: new Date(currentDate.getTime() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
      supplier: 'Medical Supplies',
      status: 'critical',
      unit: 'caixa(s)',
    },
  ];

  // Rest of the generation logic...
  const materials = [
    'Agulha Gengival',
    'Fio de Sutura',
    'Máscara Cirúrgica',
    'Broca Diamantada',
    'Ionômero de Vidro',
    'Alginato',
    'Gesso Pedra',
    'Bracket Metálico',
    'Pasta Profilática',
    'Sugador Descartável',
    'Banda Matriz',
    'Envelope para Esterilização',
  ];

  for (let i = 3; i <= 50; i++) {
    const quantity = Math.floor(Math.random() * 100);
    const minQuantity = Math.floor(Math.random() * 30) + 10;

    // Create a valid date for lastRestockDate (within the last 30 days)
    const lastRestockDate = new Date();
    lastRestockDate.setDate(
      lastRestockDate.getDate() - Math.floor(Math.random() * 30)
    );

    // Create a valid date for expiryDate (future date within 2 years)
    const expiryDate =
      Math.random() > 0.3
        ? new Date(
            currentDate.getTime() +
              (Math.floor(Math.random() * 730) + 1) * 24 * 60 * 60 * 1000
          )
        : null;

    const item: StockItem = {
      id: i,
      name: materials[(i - 3) % materials.length],
      category: categories[Math.floor(Math.random() * categories.length)],
      quantity,
      minQuantity,
      price: Math.floor(Math.random() * 500) + 50,
      lastRestockDate,
      expiryDate,
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      status:
        quantity <= minQuantity * 0.5
          ? 'critical'
          : quantity <= minQuantity
          ? 'low'
          : 'ok',
      unit: units[Math.floor(Math.random() * units.length)],
    };
    items.push(item);
  }

  return items;
};

export default function Estoque() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);

  useEffect(() => {
    setStockItems(generateStockData());
  }, []);

  const filteredItems = useMemo(() => {
    return stockItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;
      const matchesStatus = !selectedStatus || item.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [stockItems, searchTerm, selectedCategory, selectedStatus]);

  const summary = useMemo(() => {
    return {
      totalItems: filteredItems.length,
      lowStock: filteredItems.filter((item) => item.status === 'low').length,
      criticalStock: filteredItems.filter((item) => item.status === 'critical')
        .length,
      totalValue: filteredItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    };
  }, [filteredItems]);

  const chartData = useMemo(() => {
    const categoryData = categories.map((category) => ({
      name: category.split(' ')[0],
      quantidade: stockItems.filter((item) => item.category === category)
        .length,
      valor: stockItems
        .filter((item) => item.category === category)
        .reduce((sum, item) => sum + item.price * item.quantity, 0),
    }));
    return categoryData;
  }, [stockItems]);

  if (!stockItems.length) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-red-500';
      case 'low':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiBox className="text-blue-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Total de Itens</span>
          </div>
          <p className="text-2xl font-bold mt-2">{summary.totalItems}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiAlertCircle className="text-yellow-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Estoque Baixo</span>
          </div>
          <p className="text-2xl font-bold mt-2">
            {summary.lowStock + summary.criticalStock}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiPackage className="text-green-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Categorias</span>
          </div>
          <p className="text-2xl font-bold mt-2">{categories.length}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiShoppingCart className="text-purple-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Valor Total</span>
          </div>
          <p className="text-2xl font-bold mt-2">
            R$ {summary.totalValue.toLocaleString('pt-BR')}
          </p>
        </Card>
      </div>

      {/* Chart and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="md:col-span-2 p-6 h-[400px]">
          <h3 className="text-lg font-semibold mb-4">
            Distribuição por Categoria
          </h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    typeof value === 'number'
                      ? value.toLocaleString('pt-BR')
                      : value
                  }
                />
                <Bar dataKey="quantidade" fill="#8884d8" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Filters */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Filtros</h3>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Buscar item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <Select
              value={selectedCategory ?? 'all'}
              onValueChange={(value) =>
                setSelectedCategory(value === 'all' ? null : value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedStatus ?? 'all'}
              onValueChange={(value) =>
                setSelectedStatus(value === 'all' ? null : value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="ok">Normal</SelectItem>
                <SelectItem value="low">Baixo</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>

      {/* Stock Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Valor Unitário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Última Reposição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  {item.lastRestockDate
                    ? format(new Date(item.lastRestockDate), 'dd/MM/yyyy', {
                        locale: ptBR,
                      })
                    : 'N/A'}
                </TableCell>
                <TableCell>R$ {item.price.toLocaleString('pt-BR')}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === 'critical'
                        ? 'destructive'
                        : item.status === 'low'
                        ? 'secondary'
                        : 'default'
                    }
                  >
                    {item.status === 'critical'
                      ? 'Crítico'
                      : item.status === 'low'
                      ? 'Baixo'
                      : 'Normal'}
                  </Badge>
                </TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>
                  {format(item.lastRestockDate, 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
