
import { Teacher } from '@/types/Teacher'
import { PaymentRequest } from '@/types/PaymentRequest'

const STORAGE_KEY = 'teachers'
const PAYMENT_REQUESTS_KEY = 'payment_requests'


export const getTeachers = (): Teacher[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export const saveTeacher = (newTeacher: Teacher): void => {
  if (typeof window === 'undefined') return
  const teachers = getTeachers()
  teachers.push(newTeacher)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers))
}

export const updateTeacher = (id: string, updates: Partial<Teacher>): void => {
  if (typeof window === 'undefined') return
  const teachers = getTeachers()
  const index = teachers.findIndex(t => t.id === id)
  
  if (index !== -1) {
    teachers[index] = { ...teachers[index], ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers))
  }
}

export const togglePaymentStatus = (id: string): void => {
  if (typeof window === 'undefined') return
  const teachers = getTeachers()
  const teacher = teachers.find(t => t.id === id)
  
  if (teacher) {
    const newStatus = teacher.paymentStatus === 'Paid' ? 'Unpaid' : 'Paid'
    updateTeacher(id, { paymentStatus: newStatus })
  }
}

export const getPaymentRequests = (): PaymentRequest[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(PAYMENT_REQUESTS_KEY)
  return data ? JSON.parse(data) : []
}

export const savePaymentRequest = (request: PaymentRequest): void => {
  if (typeof window === 'undefined') return
  const requests = getPaymentRequests()
  requests.push(request)
  localStorage.setItem(PAYMENT_REQUESTS_KEY, JSON.stringify(requests))
}

export const updatePaymentRequest = (id: string, updates: Partial<PaymentRequest>): void => {
  if (typeof window === 'undefined') return
  const requests = getPaymentRequests()
  const index = requests.findIndex(r => r.id === id)
  
  if (index !== -1) {
    requests[index] = { ...requests[index], ...updates }
    localStorage.setItem(PAYMENT_REQUESTS_KEY, JSON.stringify(requests))
  }
}

export const getPaymentRequestsByTeacher = (teacherId: string): PaymentRequest[] => {
  const requests = getPaymentRequests()
  return requests.filter(r => r.teacherId === teacherId)
}