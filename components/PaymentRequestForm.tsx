
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getTeachers, savePaymentRequest } from '@/lib/storage'
import { Teacher } from '@/types/Teacher'
import { PaymentRequest } from '@/types/PaymentRequest'
import Alert from './Alert'
import { useRouter } from 'next/router'

export default function PaymentRequestForm() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setTeachers(getTeachers())
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedTeacher || !amount) {
      setStatus('error')
      return
    }

    setStatus('loading')

    const teacher = teachers.find(t => t.id === selectedTeacher)
    if (!teacher) {
      setStatus('error')
      return
    }

    try {
      const newRequest: PaymentRequest = {
        id: uuidv4(),
        teacherId: teacher.id,
        teacherName: teacher.name,
        teacherEmail: teacher.email,
        amount: parseFloat(amount),
        requestDate: new Date().toISOString(),
        status: 'pending',
        description
      }

      await savePaymentRequest(newRequest)
      
      // Reset form
      setSelectedTeacher('')
      setAmount('')
      setDescription('')
      setStatus('success')
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      setStatus('error')
    }
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 sm:px-8 sm:py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl sm:text-2xl">
                💲
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Send Payment Request</h2>
                <p className="text-blue-100 text-sm sm:text-base">Loading form...</p>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 sm:px-8 sm:py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl sm:text-2xl">
              💲
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Send Payment Request</h2>
              <p className="text-blue-100 text-sm sm:text-base">Create a payment request for a teacher</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3 p-6 sm:p-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Alerts */}
              {status === 'error' && (
                <div className="mb-4">
                  <Alert type="error" message="Please fill in all required fields correctly." />
                </div>
              )}
              {status === 'success' && (
                <div className="mb-4">
                  <Alert type="success" message="Payment request sent successfully!" />
                </div>
              )}

              {/* No teachers warning */}
              {teachers.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm mt-0.5">
                      ⚠️
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-yellow-900">No Teachers Available</h3>
                      <p className="text-xs text-yellow-700 mt-1">
                        Please add teachers before creating payment requests.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4 sm:space-y-6">
                {/* Two columns for Teacher and Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Teacher Select Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center space-x-2">
                        <span className="text-lg">👤</span>
                        <span>Select Teacher</span>
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 appearance-none"
                        required
                        disabled={status === 'loading' || teachers.length === 0}
                      >
                        <option value="">-- Select a teacher --</option>
                        {teachers.map(teacher => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name} - {teacher.email}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div className="w-5 h-5 text-gray-400">
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amount Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center space-x-2">
                        <span className="text-lg">💰</span>
                        <span>Amount</span>
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                        required
                        disabled={status === 'loading'}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="w-5 h-5 text-gray-400">$</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Field */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <span className="flex items-center space-x-2">
                        <span className="text-lg">📝</span>
                        <span>Description</span>
                      </span>
                    </label>
                    <span className="text-xs text-gray-500">Optional</span>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Payment for..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 resize-none"
                    disabled={status === 'loading'}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {description.length}/200 characters
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
                  disabled={status === 'loading'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === 'loading' || teachers.length === 0}
                  className="w-full sm:flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {status === 'loading' ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Request...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>📤</span>
                      <span>Send Payment Request</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Side Panel */}
          <div className="lg:w-1/3 bg-gray-50 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-gray-200">
            <div className="space-y-6">
              {/* Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">ℹ️</span> Request Information
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <div>
                      <p className="text-sm text-blue-700">
                        Payment requests will be sent with a "Pending" status. The teacher will receive a notification by email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Process Steps */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">🔄</span> Process Steps
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      1
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Select teacher</span> from your registered teacher list
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      2
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Enter amount</span> to be requested from teacher
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      3
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Add description</span> (optional) to provide context
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      4
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Send request</span> to generate payment notification
                    </div>
                  </li>
                </ul>
              </div>

              {/* Security Note */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>🔒</span>
                  <span>Your data is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 sm:px-8 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>🔒</span>
              <span>Your data is secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📧</span>
              <span>Teacher will be notified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}