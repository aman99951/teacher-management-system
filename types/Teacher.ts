export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  phone: string;
  paymentStatus: 'Paid' | 'Unpaid';
}