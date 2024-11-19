'use client';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { Badge } from '@/components/badge';
import { ScrollArea } from '@/components/scroll-area';
import { Separator } from '@/components/separator';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiGrid,
  FiSend,
  FiTrendingUp,
  FiUser,
} from 'react-icons/fi';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const messages = {
  allDay: 'Todo dia',
  previous: 'Anterior',
  next: 'Próximo',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  work_week: 'Semana de trabalho',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Não há eventos neste período.',
};

// Block specific times (weekends and Tuesday mornings)
const blockTimes = (date: Date): boolean => {
  const day = date.getDay();
  const hour = date.getHours();

  if (day === 6 || day === 0) return true;
  if (day === 2 && hour < 12) return true;
  return false;
};

export default function Home() {
  const [currentView, setCurrentView] = useState<'stats' | 'chart'>('stats');
  const [appointments] = useState([
    {
      id: 1,
      name: 'João Carlos',
      procedure: 'Fazer Canal',
      time: '09:30',
      status: 'confirmed',
    },
    {
      id: 2,
      name: 'Maria Clara',
      procedure: 'Limpeza',
      time: '10:00',
      status: 'pending',
    },
    {
      id: 3,
      name: 'Pedro Silva',
      procedure: 'Extração',
      time: '10:30',
      status: 'confirmed',
    },
    {
      id: 4,
      name: 'Ana Paula',
      procedure: 'Clareamento',
      time: '11:00',
      status: 'confirmed',
    },
    {
      id: 5,
      name: 'Carlos Eduardo',
      procedure: 'Aparelho',
      time: '11:30',
      status: 'pending',
    },
    {
      id: 6,
      name: 'Juliana Souza',
      procedure: 'Prótese',
      time: '12:00',
      status: 'confirmed',
    },
  ]);

  const [returns, setReturns] = useState([
    { id: 1, name: 'Fernanda Almeida', lastVisit: '10/11/2023' },
    { id: 2, name: 'Lucas Pereira', lastVisit: '12/11/2023' },
    { id: 3, name: 'Gabriela Costa', lastVisit: '14/11/2023' },
    { id: 4, name: 'Rafael Mendes', lastVisit: '15/11/2023' },
  ]);

  const revenueData = [
    { name: 'Segunda', revenue: 400, patients: 8 },
    { name: 'Terça', revenue: 600, patients: 10 },
    { name: 'Quarta', revenue: 800, patients: 12 },
    { name: 'Quinta', revenue: 700, patients: 9 },
    { name: 'Sexta', revenue: 900, patients: 11 },
  ];

  const handleRemoveReturn = (id: number) => {
    setReturns((prev) => prev.filter((item) => item.id !== id));
  };

  // Custom event styling
  const eventStyleGetter = (event: any) => {
    const style: React.CSSProperties = {
      backgroundColor: blockTimes(event.start) ? '#f0f0f0' : '#0ea5e9',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      pointerEvents: blockTimes(event.start) ? 'none' : 'all',
    };

    return { style };
  };

  // Custom toolbar component
  const CustomToolbar = ({ onNavigate, label }: any) => (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onNavigate('PREV')}>
          Anterior
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate('TODAY')}>
          Hoje
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate('NEXT')}>
          Próximo
        </Button>
      </div>
      <h2 className="text-lg font-semibold">{label}</h2>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      <div className="flex gap-6">
        <Card className="w-[300px] p-4 h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiClock className="text-blue-500" />
              Consultas do Dia
            </h2>
            <Badge variant="secondary">{appointments.length}</Badge>
          </div>
          <Separator className="mb-4" />
          <ScrollArea className="h-[420px] pr-4">
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium flex items-center gap-2">
                      <FiUser className="text-gray-400" />
                      {appointment.name}
                    </span>
                    <Badge
                      variant={
                        appointment.status === 'default'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {appointment.time}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointment.procedure}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="w-[300px] p-4 h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiCalendar className="text-green-500" />
              Retornos
            </h2>
            <Badge variant="secondary">{returns.length}</Badge>
          </div>
          <Separator className="mb-4" />
          <ScrollArea className="h-[420px] pr-4">
            <AnimatePresence>
              {returns.map((patient) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="p-4 mb-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-500">
                        Última visita: {patient.lastVisit}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveReturn(patient.id)}
                    >
                      <FiSend className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </Card>

        <Card className="flex-1 p-6 h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiTrendingUp className="text-emerald-500" />
              Receita Semanal
            </h2>
            <Badge variant="secondary" className="text-base py-1">
              Total: R${' '}
              {revenueData
                .reduce((acc, curr) => acc + curr.revenue, 0)
                .toLocaleString('pt-BR')}
            </Badge>
          </div>
          <Separator className="mb-2" />

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setCurrentView('stats')}
              className={`p-1 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                currentView === 'stats'
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <FiGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentView('chart')}
              className={`p-1 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                currentView === 'chart'
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <FiBarChart2 className="h-4 w-4" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {currentView === 'stats' ? (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="h-[370px]"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Média Diária</p>
                      <p className="text-2xl font-bold">
                        R${' '}
                        {(
                          revenueData.reduce(
                            (acc, curr) => acc + curr.revenue,
                            0
                          ) / revenueData.length
                        ).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Melhor Dia</p>
                      <p className="text-2xl font-bold">
                        R${' '}
                        {Math.max(
                          ...revenueData.map((d) => d.revenue)
                        ).toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {
                          revenueData.find(
                            (d) =>
                              d.revenue ===
                              Math.max(...revenueData.map((d) => d.revenue))
                          )?.name
                        }
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">
                        Total de Pacientes
                      </p>
                      <p className="text-2xl font-bold">
                        {revenueData.reduce(
                          (acc, curr) => acc + curr.patients,
                          0
                        )}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">
                        Média de Pacientes/Dia
                      </p>
                      <p className="text-2xl font-bold">
                        {(
                          revenueData.reduce(
                            (acc, curr) => acc + curr.patients,
                            0
                          ) / revenueData.length
                        ).toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="chart"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-[370px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-50"
                    />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any) => [
                        `R$ ${value.toLocaleString('pt-BR')}`,
                        'Receita',
                      ]}
                      cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }}
                    />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]}>
                      {revenueData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.revenue ===
                            Math.max(...revenueData.map((d) => d.revenue))
                              ? '#0ea5e9'
                              : '#10b981'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      <Card className="p-4 h-[500px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiCalendar className="text-blue-500" />
            Template de Agenda
          </h2>
        </div>
        <Separator className="mb-4" />
        <div className="h-[400px]">
          <Calendar
            localizer={localizer}
            events={[]}
            messages={messages}
            defaultView="week"
            views={['week']}
            min={new Date(2023, 10, 20, 7, 0)}
            max={new Date(2023, 10, 20, 20, 0)}
            step={30}
            timeslots={2}
            eventPropGetter={eventStyleGetter}
            components={{
              toolbar: CustomToolbar,
            }}
          />
        </div>
      </Card>
    </div>
  );
}
