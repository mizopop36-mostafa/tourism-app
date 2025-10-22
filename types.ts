export enum ClientType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
}

export enum TripTime {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  E_WALLET = 'E_WALLET',
}

export enum Currency {
    EGP = 'EGP',
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
}

export enum TripStatus {
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
}

export interface Booking {
  id: number;
  clientName: string;
  clientType: ClientType;
  hotel: string;
  roomNumber: string;
  adults: number;
  children: number;
  phone: string;
  tripName: string;
  tripDate: string;
  tripTime: TripTime;
  pricePerPerson: number;
  supervisorName: string;
  paymentMethod: PaymentMethod;
  currency?: Currency;
  paid: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: TripStatus;
}

export interface Trip {
  id: number;
  name: string;
  costAdult: number;
  costChild: number;
  sellPrice: number;
  sellPriceChild: number;
  flightCost: number;
  flightSellPrice: number;
  carCost: number;
  carSellPrice: number;
}

export enum ExpenseCategory {
  DRIVER_CUSTODY = 'DRIVER_CUSTODY',
  CUSTODY_SETTLEMENT = 'CUSTODY_SETTLEMENT',
  CAR_MAINTENANCE = 'CAR_MAINTENANCE',
  COMPANY_RENT = 'COMPANY_RENT',
  SALARIES = 'SALARIES',
  COMMISSIONS = 'COMMISSIONS',
}

export interface Expense {
  id: number;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
}

export interface Client {
  id: number;
  name: string;
  type: 'client';
  clientType: ClientType;
  phone: string;
  totalTrips: number;
}

export interface Supervisor {
    id: number;
    name: string;
    type: 'supervisor';
    phone: string;
    totalTrips: number;
}