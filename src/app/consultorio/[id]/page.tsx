'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { consultorios } from '../../../utils/mock';
import { AnimatePresence, motion } from 'framer-motion';
import { IConsultorio, IUserDto } from '../../../utils/dtos';
import Cadastro from '../../../components/agendamento/cadastro';
import { FaUserCircle } from 'react-icons/fa';
import { Card } from '@/components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import {
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiList,
  FiChevronRight,
} from 'react-icons/fi';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';

import { ScrollArea } from '@/components/scroll-area';
import { cn } from '@/lib/utils';
import { Steps, StepsItem } from '../../../components/steps';

export default function Consultorio() {
  const { id } = useParams();
  const consultorio = consultorios.find((c) => c.name.toLowerCase() === id);
  const [currentStep, setCurrentStep] = useState(0);

  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [user, setUser] = useState<IUserDto | null>(null);
  const [showCadastro, setShowCadastro] = useState(false);

  const handleProcedureSelect = (value: string) => {
    setSelectedProcedure(value);
    setSelectedDate(null);
    setSelectedTime(null);
    setCurrentStep(1);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setCurrentStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowCadastro(true);
    setCurrentStep(3);
  };

  const handleUserCadastro = (userData: IUserDto) => {
    setUser(userData);
    setShowCadastro(false);
    setCurrentStep(4);
  };

  const procedure = consultorio?.procedures.find(
    (p) => p.name === selectedProcedure
  );

  const availableDates = consultorio?.schedule.filter((day) =>
    day.availableTimes.some(
      (time, index, times) =>
        times.slice(index, index + Math.ceil((procedure?.duration || 0) / 30))
          .length *
          30 >=
        (procedure?.duration || 0)
    )
  );

  const consultorioImage =
    consultorio && `/consultorios/${consultorio.name.toLowerCase()}.jpg`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Card className="rounded-none border-x-0 shadow-sm dark:border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {consultorioImage ? (
              <img
                src={consultorioImage}
                alt={consultorio?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
              />
            ) : (
              <FaUserCircle size={48} className="text-primary" />
            )}
            <div>
              <h2 className="text-xl font-semibold">{consultorio?.name}</h2>
              <Badge variant="secondary" className="mt-1">
                {consultorio?.specialty}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="container mx-auto px-4 py-6">
        <Steps value={currentStep} className="mb-6">
          <StepsItem title="Procedimento" icon={FiList} />
          <StepsItem title="Data" icon={FiCalendar} />
          <StepsItem title="Horário" icon={FiClock} />
          <StepsItem title="Cadastro" icon={FiCheckCircle} />
        </Steps>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {currentStep === 0 && (
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Procedimentos Disponíveis
                  </h3>
                  <ScrollArea className="h-[50vh]">
                    <div className="space-y-2 pr-4">
                      {consultorio?.procedures.map((proc) => (
                        <Button
                          key={proc.name}
                          variant={
                            selectedProcedure === proc.name
                              ? 'default'
                              : 'outline'
                          }
                          className="w-full justify-between h-auto py-3"
                          onClick={() => handleProcedureSelect(proc.name)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              {proc.name.charAt(0).toUpperCase() +
                                proc.name.slice(1)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {proc.duration} minutos
                            </span>
                          </div>
                          <FiChevronRight
                            className={cn(
                              'transition-transform',
                              selectedProcedure === proc.name &&
                                'transform rotate-90'
                            )}
                          />
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            )}

            {currentStep === 1 && selectedProcedure && (
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Datas Disponíveis
                  </h3>
                  <ScrollArea className="h-[50vh]">
                    <div className="grid grid-cols-1 gap-2 pr-4">
                      {availableDates?.map((day) => (
                        <Button
                          key={day.date}
                          variant={
                            selectedDate === day.date ? 'default' : 'outline'
                          }
                          className="w-full justify-between h-auto py-3"
                          onClick={() => handleDateSelect(day.date)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              {new Date(day.date).toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                              })}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {day.availableTimes.length} horários disponíveis
                            </span>
                          </div>
                          <FiChevronRight
                            className={cn(
                              'transition-transform',
                              selectedDate === day.date && 'transform rotate-90'
                            )}
                          />
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            )}

            {currentStep === 2 && selectedDate && (
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Horários Disponíveis
                  </h3>
                  <ScrollArea className="h-[50vh]">
                    <div className="grid grid-cols-2 gap-2 pr-4">
                      {consultorio?.schedule
                        .find((day) => day.date === selectedDate)
                        ?.availableTimes.filter(
                          (time, index, times) =>
                            times.slice(
                              index,
                              index + Math.ceil((procedure?.duration || 0) / 30)
                            ).length *
                              30 >=
                            (procedure?.duration || 0)
                        )
                        .map((time) => (
                          <Button
                            key={time}
                            variant={
                              selectedTime === time ? 'default' : 'outline'
                            }
                            onClick={() => handleTimeSelect(time)}
                          >
                            {time}
                          </Button>
                        ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            )}

            {currentStep === 3 && showCadastro && !user && (
              <Cadastro user={user} setUser={handleUserCadastro} />
            )}

            {currentStep === 4 && user && (
              <Card className="p-6 space-y-6">
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">
                    Agendamento Confirmado
                  </h3>
                  <p className="text-muted-foreground">
                    Seu agendamento foi realizado com sucesso
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Procedimento</span>
                    {selectedProcedure && (
                      <span className="font-medium">
                        {selectedProcedure?.charAt(0).toUpperCase() +
                          selectedProcedure?.slice(1)}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Data</span>
                    <span className="font-medium">
                      {selectedDate &&
                        new Date(selectedDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Horário</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Paciente</span>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
