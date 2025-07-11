import { useState, useEffect } from 'react'
import { saveTeacher } from '@/lib/storage'
import { v4 as uuidv4 } from 'uuid'
import Alert from './Alert'
import { useRouter } from 'next/router'
import { Teacher } from '@/types/Teacher'

const TeacherForm = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', phone: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    if (!form.name || !form.email || !form.subject || !form.phone) {
      setError('All fields are required.')
      setLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (!phoneRegex.test(form.phone)) {
      setError('Please enter a valid phone number.')
      setLoading(false)
      return
    }

    try {
      const newTeacher: Teacher = {
        id: uuidv4(),
        name: form.name,
        email: form.email,
        subject: form.subject,
        phone: form.phone,
        paymentStatus: 'Unpaid' as const,
      }

      saveTeacher(newTeacher)
      setForm({ name: '', email: '', subject: '', phone: '' })
      setError('')
      setSuccess(true)
      setLoading(false)

      // Optional: Redirect after save
      setTimeout(() => router.push('/teachers'), 1500)
    } catch (err) {
      setError('Failed to save teacher. Please try again.')
      setLoading(false)
    }
  }

  const formFields = [
    { 
      name: 'name', 
      label: 'Full Name', 
      type: 'text', 
      placeholder: 'Enter teacher\'s full name',
      icon: '👤'
    },
    { 
      name: 'email', 
      label: 'Email Address', 
      type: 'email', 
      placeholder: 'teacher@example.com',
      icon: '📧'
    },
    { 
      name: 'subject', 
      label: 'Subject', 
      type: 'text', 
      placeholder: 'Mathematics, English, Science...',
      icon: '📚'
    },
    { 
      name: 'phone', 
      label: 'Phone Number', 
      type: 'tel', 
      placeholder: '+1 (555) 123-4567',
      icon: '📞'
    }
  ]

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="w-full max-w-none sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto px-4 sm:px-0">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 sm:px-8 sm:py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl sm:text-2xl">
                ➕
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Add New Teacher</h2>
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
    <div className="w-full max-w-none sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto px-4 sm:px-0">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 sm:px-8 sm:py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl sm:text-2xl">
              ➕
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Add New Teacher</h2>
              <p className="text-blue-100 text-sm sm:text-base">Enter teacher details below</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Alerts */}
          {error && (
            <div className="mb-4">
              <Alert type="error" message={error} />
            </div>
          )}
          {success && (
            <div className="mb-4">
              <Alert type="success" message="Teacher added successfully! Redirecting..." />
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {formFields.map((field) => (
              <div key={field.name} className={field.name === 'name' || field.name === 'email' ? 'sm:col-span-2' : ''}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center space-x-2">
                    <span className="text-lg">{field.icon}</span>
                    <span>{field.label}</span>
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    name={field.name}
                    type={field.type}
                    value={(form as any)[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    required
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <div className="w-5 h-5 text-gray-400">
                      {field.name === 'name' && '👤'}
                      {field.name === 'email' && '📧'}
                      {field.name === 'subject' && '📚'}
                      {field.name === 'phone' && '📞'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mt-0.5">
                ℹ️
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-900">Default Settings</h3>
                <p className="text-xs text-blue-700 mt-1">
                  New teachers will be added with "Unpaid" payment status. You can update this later from the teachers list.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding Teacher...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>➕</span>
                  <span>Add Teacher</span>
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 sm:px-8 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>🔒</span>
              <span>Your data is secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📝</span>
              <span>All fields required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherForm