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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Switch } from '@/components/switch';
import { Progress } from '@/components/progress';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  FiUser,
  FiDollarSign,
  FiPhone,
  FiUserCheck,
  FiUserX,
  FiClock,
  FiShield,
  FiEdit,
  FiAward,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Types
type PaymentStatus = 'paid' | 'pending';

interface Permission {
  agenda: boolean;
  financeiro: boolean;
  estoque: boolean;
  funcionarios: boolean;
}

interface Performance {
  calls: number;
  returns: number;
  problems: number;
  lateArrivals: number;
  returnRate: number;
  satisfactionRate: number;
}

interface Employee {
  id: number;
  name: string;
  role: 'secretary' | 'cleaning';
  startDate: Date;
  salary: number;
  lastPayment: Date | null;
  status: 'active' | 'inactive';
  permissions: Permission;
  performance?: Performance;
  monthlyCost: number;
  paymentHistory: {
    date: Date;
    value: number;
    status: PaymentStatus;
  }[];
}

// Mock data generator
const generateEmployeeData = (): Employee[] => {
  const secretaryNames = [
    'Ana Silva',
    'Maria Santos',
    'Juliana Oliveira',
    'Carolina Lima',
  ];

  const cleaningNames = ['Pedro Souza', 'João Ferreira', 'Márcia Costa'];

  const employees: Employee[] = [];
  const currentDate = new Date();

  // Generate secretaries
  secretaryNames.forEach((name, index) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 24));

    const performance: Performance = {
      calls: Math.floor(Math.random() * 500) + 300,
      returns: Math.floor(Math.random() * 100) + 50,
      problems: Math.floor(Math.random() * 20),
      lateArrivals: Math.floor(Math.random() * 5),
      returnRate: Math.floor(Math.random() * 30) + 70,
      satisfactionRate: Math.floor(Math.random() * 20) + 80,
    };

    const paymentHistory = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        date: new Date(date.getFullYear(), date.getMonth(), 5),
        value: 2500,
        status: (i === 0 ? 'pending' : 'paid') as PaymentStatus,
      };
    });

    employees.push({
      id: index + 1,
      name,
      role: 'secretary',
      startDate,
      salary: 2500,
      lastPayment: paymentHistory[1].date,
      status: 'active',
      permissions: {
        agenda: true,
        financeiro: index === 0,
        estoque: index === 0,
        funcionarios: false,
      },
      performance,
      monthlyCost: 2500,
      paymentHistory,
    });
  });

  // Generate cleaning staff
  cleaningNames.forEach((name, index) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 24));

    const paymentHistory = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        date: new Date(date.getFullYear(), date.getMonth(), 5),
        value: 1800,
        status: i === 0 ? 'pending' : ('paid' as PaymentStatus),
      };
    });

    employees.push({
      id: secretaryNames.length + index + 1,
      name,
      role: 'cleaning',
      startDate,
      salary: 1800,
      lastPayment: paymentHistory[1].date,
      status: 'active',
      permissions: {
        agenda: false,
        financeiro: false,
        estoque: false,
        funcionarios: false,
      },
      monthlyCost: 1800,
      paymentHistory,
    });
  });

  return employees;
};

// Performance chart data generator
const generatePerformanceData = (employees: Employee[]) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

  return months.map((month) => {
    const data: any = { name: month };
    employees
      .filter((emp) => emp.role === 'secretary')
      .forEach((emp) => {
        data[emp.name] = Math.floor(Math.random() * 20) + 80;
      });
    return data;
  });
};

export default function Funcionarios() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    const data = generateEmployeeData();
    setEmployees(data);
    setPerformanceData(generatePerformanceData(data));
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = employee.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesRole =
        selectedRole === 'all' || employee.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [employees, searchTerm, selectedRole]);

  const summary = useMemo(() => {
    return {
      totalEmployees: employees.length,
      activeEmployees: employees.filter((emp) => emp.status === 'active')
        .length,
      totalCost: employees.reduce((sum, emp) => sum + emp.monthlyCost, 0),
      pendingPayments: employees.filter(
        (emp) => emp.paymentHistory[0]?.status === 'pending'
      ).length,
    };
  }, [employees]);

  const togglePermission = (
    employeeId: number,
    permission: keyof Permission
  ) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            permissions: {
              ...emp.permissions,
              [permission]: !emp.permissions[permission],
            },
          };
        }
        return emp;
      })
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiUser className="text-blue-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Total de Funcionários</span>
          </div>
          <p className="text-2xl font-bold mt-2">{summary.totalEmployees}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiUserCheck className="text-green-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Ativos</span>
          </div>
          <p className="text-2xl font-bold mt-2">{summary.activeEmployees}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiDollarSign className="text-purple-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Custo Mensal</span>
          </div>
          <p className="text-2xl font-bold mt-2">
            R$ {summary.totalCost.toLocaleString('pt-BR')}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiClock className="text-yellow-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Pagamentos Pendentes</span>
          </div>
          <p className="text-2xl font-bold mt-2">{summary.pendingPayments}</p>
        </Card>
      </div>

      {/* Performance Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 p-6 h-[400px]">
          <h3 className="text-lg font-semibold mb-4">
            Performance das Secretárias
          </h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {employees
                  .filter((emp) => emp.role === 'secretary')
                  .map((secretary, index) => (
                    <Line
                      key={secretary.id}
                      type="monotone"
                      dataKey={secretary.name}
                      stroke={`hsl(${index * 90}, 70%, 50%)`}
                      strokeWidth={2}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Filters */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Filtros</h3>
          <div className="space-y-4">
            <Input
              placeholder="Buscar funcionário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />

            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="secretary">Secretárias</SelectItem>
                <SelectItem value="cleaning">Limpeza</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>

      {/* Employees Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Último Pagamento</TableHead>
              <TableHead>Permissões</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">
                  <div>
                    {employee.name}
                    <p className="text-sm text-gray-500">
                      Desde{' '}
                      {format(employee.startDate, 'MMM yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {employee.role === 'secretary' ? 'Secretária' : 'Limpeza'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      employee.status === 'active' ? 'default' : 'secondary'
                    }
                  >
                    {employee.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {employee.role === 'secretary' && employee.performance ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Taxa de Retorno</span>
                        <span className="font-medium">
                          {employee.performance.returnRate}%
                        </span>
                      </div>
                      <Progress
                        value={employee.performance.returnRate}
                        className={`h-2 ${
                          employee.performance.returnRate >= 90
                            ? 'bg-green-500'
                            : employee.performance.returnRate >= 70
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      />
                    </div>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {employee.lastPayment
                    ? format(employee.lastPayment, 'dd/MM/yyyy', {
                        locale: ptBR,
                      })
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {employee.role === 'secretary' ? (
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FiShield className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Permissões - {employee.name}
                            </DialogTitle>
                            <DialogDescription>
                              Gerencie as permissões do funcionário no sistema
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="flex items-center justify-between">
                              <label>Agenda</label>
                              <Switch
                                checked={employee.permissions.agenda}
                                onCheckedChange={() =>
                                  togglePermission(employee.id, 'agenda')
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label>Financeiro</label>
                              <Switch
                                checked={employee.permissions.financeiro}
                                onCheckedChange={() =>
                                  togglePermission(employee.id, 'financeiro')
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label>Estoque</label>
                              <Switch
                                checked={employee.permissions.estoque}
                                onCheckedChange={() =>
                                  togglePermission(employee.id, 'estoque')
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label>Funcionários</label>
                              <Switch
                                checked={employee.permissions.funcionarios}
                                onCheckedChange={() =>
                                  togglePermission(employee.id, 'funcionarios')
                                }
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FiEdit className="h-4 w-4" />
                    </Button>
                    {employee.role === 'secretary' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FiAward className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>
                              Performance - {employee.name}
                            </DialogTitle>
                            <DialogDescription>
                              Detalhes de performance do funcionário
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">
                                  Ligações Atendidas
                                </p>
                                <p className="text-2xl font-bold">
                                  {employee.performance?.calls}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">
                                  Retornos Realizados
                                </p>
                                <p className="text-2xl font-bold">
                                  {employee.performance?.returns}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">
                                  Problemas Reportados
                                </p>
                                <p className="text-2xl font-bold">
                                  {employee.performance?.problems}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Atrasos</p>
                                <p className="text-2xl font-bold">
                                  {employee.performance?.lateArrivals}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Taxa de Satisfação</span>
                                <span className="font-medium">
                                  {employee.performance?.satisfactionRate}%
                                </span>
                              </div>
                              <Progress
                                value={employee.performance?.satisfactionRate}
                                className={`h-2 ${
                                  (employee.performance?.satisfactionRate ||
                                    0) >= 90
                                    ? 'bg-green-500'
                                    : (employee.performance?.satisfactionRate ||
                                        0) >= 70
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
