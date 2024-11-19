export enum HealthcarePlans {
  Unimed = 'Unimed',
  Bradesco = 'Bradesco',
}

export interface IUserDto {
  name: string;
  sex: 'male' | 'female';
  dateOfBirth: Date;
  phone: string;
  postalCode: string;
  addressLine: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  cpf?: string;
  healthcardPlan?: HealthcarePlans;
  healthcarePlanId?: string;
}

export type Gender = 'male' | 'female';

export interface IMaterial {
  name: string;
  quantity: number;
}

export interface IProcedure {
  name: string;
  duration: number;
  materials: IMaterial[];
}

export interface ISchedule {
  date: string;
  availableTimes: string[];
}

export interface IConsultorio {
  name: string;
  specialty: string;
  gender: Gender;
  procedures: IProcedure[];
  schedule: ISchedule[];
}
