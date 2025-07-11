import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { getTeachers, getPaymentRequestsByTeacher } from '@/lib/storage'
import { Teacher } from '@/types/Teacher'
import { PaymentRequest } from '@/types/PaymentRequest'
import Link from 'next/link'

export default function TeacherDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([])

  useEffect(() => {
    if (id && typeof id === 'string') {
      const teachers = getTeachers()
      const foundTeacher = teachers.find(t => t.id === id)
      setTeacher(foundTeacher || null)
      
      if (foundTeacher) {
        setPaymentRequests(getPaymentRequestsByTeacher(id))
      }
    }
  }, [id])

  if (!teacher) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-500">Teacher not found</p>
          <Link href="/teachers" className="text-blue-600 hover:underline">
            Back to teachers
          </Link>
        </div>
      </Layout>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: PaymentRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
    }
  }

  return (
    <Layout>
      <div className="mb-6">
        <Link href="/teachers" className="text-blue-600 hover:underline">
          ← Back to teachers
        </Link>
      </div>

      {/* Teacher Info Card */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">{teacher.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{teacher.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone</p>
            <p className="font-medium">{teacher.phone}</p>
          </div>
          <div>
            <p className="text-gray-600">Subject</p>
            <p className="font-medium">{teacher.subject}</p>
          </div>
          <div>
            <p className="text-gray-600">Payment Status</p>
            <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
              teacher.paymentStatus === 'Paid' 
                ? 'bg-green-200 text-green-800' 
                : 'bg-red-200 text-red-800'
            }`}>
              {teacher.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Payment History</h3>
        {paymentRequests.length === 0 ? (
          <p className="text-gray-500">No payment requests for this teacher</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentRequests.map((request) => (
                  <tr key={request.id} className="border-b">
                    <td className="px-4 py-2">{formatDate(request.requestDate)}</td>
                    <td className="px-4 py-2">${request.amount.toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm">{request.description || '-'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}