export interface InvoiceItem {
  id: string;
  service: string;
  prestation: string;
  priceUsd: number;
  quantity: number;
  unit: string;
}

export interface InvoiceData {
  invoiceNo: string;
  date: string;
  guichet: string;
  cashier: string;
  status: string;
  nub: string;
  patientName: string;
  sex: string;
  age: number;
  origin: string;
  residence: string;
  organizationName: string;
  items: InvoiceItem[];
  amountReceivedUsd: number;
  amountReceivedKhr: number;
}

export const EXCHANGE_RATE = 4000;
