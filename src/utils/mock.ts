import { IConsultorio, IUserDto, HealthcarePlans } from './dtos';

export const mockUsers: IUserDto[] = [
  {
    name: 'Hugo Pereira',
    sex: 'male',
    dateOfBirth: new Date(1998, 4, 3),
    phone: '11951721260',
    postalCode: '27251363',
    addressLine: 'Rua Wladyr Correa Lopes, 69',
    neighborhood: 'Jardim Provence',
    city: 'Volta Redonda',
    state: 'RJ',
    country: 'Brasil',
    cpf: '16941536345',
    healthcardPlan: HealthcarePlans.Unimed,
    healthcarePlanId: '123',
  },
];

export const consultorios: IConsultorio[] = [
  {
    name: 'Pedro',
    specialty: 'Dentista',
    gender: 'male',
    procedures: [
      {
        name: 'limpeza',
        duration: 30,
        materials: [
          { name: 'gel dental', quantity: 1 },
          { name: 'fio dental', quantity: 1 },
        ],
      },
      {
        name: 'canal',
        duration: 60,
        materials: [
          { name: 'agulha', quantity: 1 },
          { name: 'anestesia', quantity: 2 },
        ],
      },
      {
        name: 'remoção',
        duration: 45,
        materials: [
          { name: 'pinça', quantity: 1 },
          { name: 'gaze', quantity: 2 },
        ],
      },
    ],
    schedule: [
      {
        date: '2024-11-09',
        availableTimes: [],
      },
      {
        date: '2024-11-10',
        availableTimes: [],
      },
      {
        date: '2024-11-11',
        availableTimes: ['09:00', '09:30', '11:00', '12:00', '13:30', '15:00'],
      },
      {
        date: '2024-11-12',
        availableTimes: ['10:00', '11:30', '13:00', '16:00'],
      },
      {
        date: '2024-11-13',
        availableTimes: ['09:30', '10:30', '11:30', '12:30', '14:30'],
      },
      {
        date: '2024-11-14',
        availableTimes: ['08:30', '09:00', '10:30', '11:00', '13:30', '15:30'],
      },
      {
        date: '2024-11-15',
        availableTimes: ['09:00', '10:30', '13:00', '14:30', '16:00'],
      },
      {
        date: '2024-11-16',
        availableTimes: ['08:30', '09:30', '11:00', '12:00', '14:00', '15:00'],
      },
      {
        date: '2024-11-17',
        availableTimes: ['09:00', '10:00', '11:30', '13:00', '14:30', '16:30'],
      },
      {
        date: '2024-11-18',
        availableTimes: ['10:30', '11:30', '13:30', '15:00', '16:00', '17:30'],
      },
      {
        date: '2024-11-19',
        availableTimes: ['08:30', '10:00', '12:00', '13:30', '15:30', '17:00'],
      },
      {
        date: '2024-11-20',
        availableTimes: ['09:30', '10:30', '11:30', '14:00', '15:30'],
      },
      {
        date: '2024-11-21',
        availableTimes: ['09:00', '10:00', '11:30', '13:30', '15:30', '16:30'],
      },
      {
        date: '2024-11-22',
        availableTimes: ['10:00', '12:30', '14:30', '17:00'],
      },
    ],
  },
  {
    name: 'Julia',
    specialty: 'Obstetra',
    gender: 'female',
    procedures: [
      {
        name: 'atendimento',
        duration: 20,
        materials: [
          { name: 'estetoscópio', quantity: 1 },
          { name: 'luvas', quantity: 1 },
        ],
      },
      {
        name: 'ultrassom',
        duration: 45,
        materials: [
          { name: 'gel para ultrassom', quantity: 1 },
          { name: 'luvas', quantity: 1 },
        ],
      },
      {
        name: 'procedimento obstétrico',
        duration: 90,
        materials: [
          { name: 'kit obstétrico', quantity: 1 },
          { name: 'anestesia', quantity: 1 },
          { name: 'luvas estéreis', quantity: 1 },
        ],
      },
    ],
    schedule: [
      {
        date: '2024-11-09',
        availableTimes: [],
      },
      {
        date: '2024-11-10',
        availableTimes: [],
      },
      {
        date: '2024-11-11',
        availableTimes: ['09:00', '09:30', '10:30', '13:00', '15:30'],
      },
      {
        date: '2024-11-12',
        availableTimes: ['08:30', '11:00', '14:30', '16:30'],
      },
      {
        date: '2024-11-13',
        availableTimes: ['09:00', '10:00', '12:00', '14:00', '16:00'],
      },
      {
        date: '2024-11-14',
        availableTimes: ['08:30', '10:30', '13:00', '15:30', '17:30'],
      },
      {
        date: '2024-11-15',
        availableTimes: ['09:30', '12:00', '14:30', '16:30'],
      },
      {
        date: '2024-11-16',
        availableTimes: ['09:00', '11:30', '13:30', '16:00'],
      },
      {
        date: '2024-11-17',
        availableTimes: ['09:30', '10:30', '12:30', '14:30', '15:30'],
      },
      {
        date: '2024-11-18',
        availableTimes: ['08:00', '10:00', '12:00', '15:00', '17:00'],
      },
      {
        date: '2024-11-19',
        availableTimes: ['09:00', '10:30', '13:00', '15:30', '16:30'],
      },
      {
        date: '2024-11-20',
        availableTimes: ['08:30', '09:30', '12:00', '13:30', '15:30'],
      },
      {
        date: '2024-11-21',
        availableTimes: ['09:00', '10:30', '12:30', '14:30', '16:00'],
      },
      {
        date: '2024-11-22',
        availableTimes: ['08:30', '11:00', '13:30', '16:30'],
      },
    ],
  },
];
