'use client';
import { DateRange } from 'react-day-picker';
import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  FiCalendar,
  FiFilter,
  FiDollarSign,
  FiUsers,
  FiClock,
} from 'react-icons/fi';

// Mock data generator
const generateAppointments = (count: number) => {
  const procedures = [
    { name: 'Limpeza', duration: 60, price: 150 },
    { name: 'Extração', duration: 45, price: 300 },
    { name: 'Canal', duration: 90, price: 800 },
    { name: 'Restauração', duration: 60, price: 200 },
    { name: 'Clareamento', duration: 120, price: 1200 },
    { name: 'Avaliação', duration: 30, price: 100 },
    { name: 'Prótese', duration: 90, price: 2000 },
    { name: 'Implante', duration: 120, price: 3000 },
  ];

  const firstNames = [
    'João',
    'Maria',
    'Pedro',
    'Ana',
    'Carlos',
    'Beatriz',
    'Lucas',
    'Julia',
  ];
  const lastNames = [
    'Silva',
    'Santos',
    'Oliveira',
    'Souza',
    'Rodrigues',
    'Ferreira',
    'Almeida',
  ];
  const healthPlans = ['Unimed', 'Bradesco', 'Amil', null];

  return Array.from({ length: count }, (_, index) => {
    const procedure = procedures[Math.floor(Math.random() * procedures.length)];
    const healthPlan =
      healthPlans[Math.floor(Math.random() * healthPlans.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    // Generate date within last 6 months
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
    date.setDate(Math.floor(Math.random() * 28) + 1);

    return {
      id: index + 1,
      patient: `${firstName} ${lastName}`,
      procedure: procedure.name,
      date: date,
      duration: procedure.duration,
      value: healthPlan ? procedure.price * 0.7 : procedure.price, // 30% discount for health plan
      healthPlan,
    };
  });
};

export default function Consultas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHealthPlan, setSelectedHealthPlan] = useState<string | null>(
    null
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  // Generate 100 appointments
  const allAppointments = useMemo(() => generateAppointments(100), []);

  // Filter appointments based on search, health plan, and date range
  const filteredAppointments = useMemo(() => {
    return allAppointments.filter((appointment) => {
      const matchesSearch =
        appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.procedure.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesHealthPlan =
        !selectedHealthPlan || appointment.healthPlan === selectedHealthPlan;
      const matchesDateRange =
        (!dateRange?.from || appointment.date >= dateRange?.from) &&
        (!dateRange?.to || appointment.date <= dateRange?.to);

      return matchesSearch && matchesHealthPlan && matchesDateRange;
    });
  }, [allAppointments, searchTerm, selectedHealthPlan, dateRange]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    return {
      totalPatients: filteredAppointments.length,
      totalRevenue: filteredAppointments.reduce(
        (sum, app) => sum + app.value,
        0
      ),
      avgDuration: Math.round(
        filteredAppointments.reduce((sum, app) => sum + app.duration, 0) /
          filteredAppointments.length
      ),
      withHealthPlan: filteredAppointments.filter((app) => app.healthPlan)
        .length,
    };
  }, [filteredAppointments]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiUsers className="text-blue-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Total de Pacientes</span>
          </div>
          <p className="text-2xl font-bold mt-2">{summary.totalPatients}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiDollarSign className="text-green-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Receita Total</span>
          </div>
          <p className="text-2xl font-bold mt-2">
            R$ {summary.totalRevenue.toLocaleString('pt-BR')}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiClock className="text-orange-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Duração Média</span>
          </div>
          <p className="text-2xl font-bold mt-2">{summary.avgDuration} min</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FiUsers className="text-purple-500 h-5 w-5" />
            <span className="text-sm text-gray-500">Com Convênio</span>
          </div>
          <p className="text-2xl font-bold mt-2">{summary.withHealthPlan}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Buscar por paciente ou procedimento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px]">
                <FiFilter className="mr-2 h-4 w-4" />
                {selectedHealthPlan || 'Convênio'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={!selectedHealthPlan}
                onCheckedChange={() => setSelectedHealthPlan(null)}
              >
                Todos
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedHealthPlan === 'Unimed'}
                onCheckedChange={() => setSelectedHealthPlan('Unimed')}
              >
                Unimed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedHealthPlan === 'Bradesco'}
                onCheckedChange={() => setSelectedHealthPlan('Bradesco')}
              >
                Bradesco
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedHealthPlan === 'Amil'}
                onCheckedChange={() => setSelectedHealthPlan('Amil')}
              >
                Amil
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[250px]">
                <FiCalendar className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange?.to ? (
                    <>
                      {format(dateRange?.from, 'dd/MM/yy', { locale: ptBR })} -{' '}
                      {format(dateRange?.to, 'dd/MM/yy', { locale: ptBR })}
                    </>
                  ) : (
                    format(dateRange?.from, 'dd/MM/yy', { locale: ptBR })
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

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Procedimento</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Convênio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    {appointment.patient}
                  </TableCell>
                  <TableCell>{appointment.procedure}</TableCell>
                  <TableCell>
                    {format(appointment.date, 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>{appointment.duration} min</TableCell>
                  <TableCell>
                    R$ {appointment.value.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {appointment.healthPlan ? (
                      <Badge variant="secondary">
                        {appointment.healthPlan}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Particular</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </Card>
    </motion.div>
  );
}
