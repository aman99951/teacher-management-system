// types/PaymentRequest.ts
export interface PaymentRequest {
  id: string
  teacherId: string
  teacherName: string
  teacherEmail: string
  amount: number
  requestDate: string
  status: 'pending' | 'completed' | 'cancelled'
  description?: string
}