'use client';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Form, FormLabel } from '@/components/form';
import { Input } from '@/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HealthcarePlans, IUserDto } from '../../utils/dtos';
import { mockUsers } from '../../utils/mock';

interface UserRegistrationFormProps {
  user: IUserDto | null;
  setUser: (user: IUserDto) => void;
}

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => (
  <div className="flex items-center gap-2 mb-6">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <div key={index} className="flex-1 flex items-center">
        <div
          className={cn(
            'w-full h-2 rounded-full transition-all duration-300',
            index < currentStep ? 'bg-primary' : 'bg-muted'
          )}
        />
      </div>
    ))}
  </div>
);

const Cadastro: React.FC<UserRegistrationFormProps> = ({ user, setUser }) => {
  const form = useForm<IUserDto>({
    defaultValues: user || {
      name: '',
      phone: '',
      sex: undefined,
      dateOfBirth: undefined,
      addressLine: '',
      neighborhood: '',
      city: '',
      state: '',
      country: 'Brasil',
      postalCode: '',
      cpf: '',
      healthcardPlan: undefined,
      healthcarePlanId: '',
    },
  });
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<IUserDto>(user || ({} as IUserDto));
  const [loadingAddress, setLoadingAddress] = useState(false);

  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) =>
    (currentYear - i).toString()
  );

  const formatCep = (cep: string) =>
    cep.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2');

  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const formatCpf = (cpf: string) => {
    const digits = cpf.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{2})$/, '$1-$2');
  };

  const fetchAddressByCep = async (cep: string) => {
    setLoadingAddress(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          addressLine: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
          country: 'Brasil',
          postalCode: cep,
        }));
      } else {
        console.error('Error fetching address');
      }
    } catch (error) {
      console.error('Error fetching address', error);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleInputChange = (field: keyof IUserDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCepChange = (value: string) => {
    const formattedCep = formatCep(value);
    handleInputChange('postalCode', formattedCep);
    if (formattedCep.length === 9) {
      fetchAddressByCep(formattedCep);
    }
  };

  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      const date = new Date(
        parseInt(selectedYear, 10),
        parseInt(selectedMonth, 10) - 1,
        parseInt(selectedDay, 10)
      );
      handleInputChange('dateOfBirth', date);
    }
  }, [selectedDay, selectedMonth, selectedYear]);

  const handleConfirmStep = () => {
    if (
      formData.name &&
      formData.sex &&
      formData.phone &&
      formData.dateOfBirth
    ) {
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    setUser(formData);
    setStep(0);
  };

  const handlePhoneBlur = () => {
    const matchedUser = mockUsers.find((user) => user.phone === formData.phone);
    if (matchedUser) {
      setFormData(matchedUser); // Populate form data with matched user's information
      setUser(matchedUser); // Close the form by setting the user immediately
      setStep(0); // Reset step to close form view
    }
  };

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto">
      <Form {...form}>
        <div className="flex flex-col mb-6">
          <StepIndicator currentStep={step} totalSteps={3} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormLabel>
                    Telefone<span className="text-red-500">*</span>
                  </FormLabel>
                  <Input
                    value={formatPhone(formData.phone || '')}
                    onChange={(e) =>
                      handleInputChange(
                        'phone',
                        e.target.value.replace(/\D/g, '')
                      )
                    }
                    onBlur={handlePhoneBlur}
                    placeholder="(24) 9 9999-9999"
                  />
                </div>

                <div>
                  <FormLabel>
                    Nome Completo<span className="text-red-500">*</span>
                  </FormLabel>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Digite seu nome completo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FormLabel>
                    Data de Nascimento<span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger>
                        <SelectValue placeholder="Dia" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedMonth}
                      onValueChange={setSelectedMonth}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Mês" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedYear}
                      onValueChange={setSelectedYear}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ano" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel>
                    Sexo<span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={formData.sex === 'male' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('sex', 'male')}
                      className="w-full"
                    >
                      Masculino
                    </Button>
                    <Button
                      type="button"
                      variant={
                        formData.sex === 'female' ? 'default' : 'outline'
                      }
                      onClick={() => handleInputChange('sex', 'female')}
                      className="w-full"
                    >
                      Feminino
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="address"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormLabel>CEP</FormLabel>
                  <Input
                    value={formData.postalCode || ''}
                    onChange={(e) => handleCepChange(e.target.value)}
                    placeholder="00000-000"
                    disabled={loadingAddress}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <FormLabel>Endereço</FormLabel>
                  <Input
                    value={formData.addressLine || ''}
                    onChange={(e) =>
                      handleInputChange('addressLine', e.target.value)
                    }
                    placeholder="Rua, número, complemento"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <FormLabel>Bairro</FormLabel>
                  <Input
                    value={formData.neighborhood || ''}
                    onChange={(e) =>
                      handleInputChange('neighborhood', e.target.value)
                    }
                  />
                </div>

                <div>
                  <FormLabel>Cidade</FormLabel>
                  <Input
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>

                <div>
                  <FormLabel>Estado</FormLabel>
                  <Input
                    value={formData.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </div>

                <div>
                  <FormLabel>País</FormLabel>
                  <Input
                    value={formData.country || 'Brasil'}
                    onChange={(e) =>
                      handleInputChange('country', e.target.value)
                    }
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormLabel>CPF</FormLabel>
                  <Input
                    value={formatCpf(formData.cpf || '')}
                    onChange={(e) =>
                      handleInputChange(
                        'cpf',
                        e.target.value.replace(/\D/g, '')
                      )
                    }
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <FormLabel>Convênio Médico</FormLabel>
                  <Select
                    value={formData.healthcardPlan}
                    onValueChange={(value) =>
                      handleInputChange(
                        'healthcardPlan',
                        value as HealthcarePlans
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu convênio" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(HealthcarePlans).map((plan) => (
                        <SelectItem key={plan} value={plan}>
                          {plan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {formData.healthcardPlan && (
                    <Input
                      value={formData.healthcarePlanId || ''}
                      onChange={(e) =>
                        handleInputChange('healthcarePlanId', e.target.value)
                      }
                      placeholder="Número do Convênio"
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              Voltar
            </Button>
          )}
          <Button
            type="button"
            className={cn('ml-auto', step === 1 && 'w-full')}
            onClick={step === 3 ? handleSubmit : handleConfirmStep}
            disabled={
              step === 1 &&
              (!formData.name ||
                !formData.sex ||
                !formData.phone ||
                !formData.dateOfBirth)
            }
          >
            {step === 3 ? 'Finalizar' : 'Próximo'}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default Cadastro;
