import { Teacher } from '@/types/Teacher'
import { getPaymentRequestsByTeacher } from '@/lib/storage'
import Link from 'next/link'
import { useState, useEffect } from 'react'

type Props = {
  teachers: Teacher[]
  onStatusChange: (id: string) => void
}

export default function TeacherTable({ teachers, onStatusChange }: Props) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('cards')
      } else {
        setViewMode('table')
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getPendingRequestsCount = (teacherId: string) => {
    const requests = getPaymentRequestsByTeacher(teacherId)
    return requests.filter(r => r.status === 'pending').length
  }

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (teachers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
          👥
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Teachers Found</h3>
        <p className="text-gray-600 mb-4">Get started by adding your first teacher to the system.</p>
        <Link 
          href="/teachers/add"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        >
          <span className="mr-2">➕</span>
          Add Teacher
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
              👥
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Teachers</h2>
              <p className="text-blue-100 text-sm">{teachers.length} teacher{teachers.length !== 1 ? 's' : ''} total</p>
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`hidden sm:flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                viewMode === 'table' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              📊 Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                viewMode === 'cards' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              📱 Cards
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Requests
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((t) => {
                const pendingCount = getPendingRequestsCount(t.id)
                return (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-4">
                      <Link href={`/teachers/${t.id}`} className="group">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {t.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {t.name}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{t.email}</div>
                      <div className="text-sm text-gray-500">{t.phone}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        📚 {t.subject}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        t.paymentStatus === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {t.paymentStatus === 'Paid' ? '✅' : '⏳'} {t.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {pendingCount > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          📋 {pendingCount} pending
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => onStatusChange(t.id)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                          t.paymentStatus === 'Paid'
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm'
                            : 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
                        }`}
                      >
                        {t.paymentStatus === 'Paid' ? '❌ Mark Unpaid' : '✅ Mark Paid'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((t) => {
              const pendingCount = getPendingRequestsCount(t.id)
              return (
                <div key={t.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-gray-200">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <Link href={`/teachers/${t.id}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          {t.name}
                        </Link>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      t.paymentStatus === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {t.paymentStatus === 'Paid' ? '✅' : '⏳'}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>📧</span>
                      <span className="truncate">{t.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>📞</span>
                      <span>{t.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>📚</span>
                      <span>{t.subject}</span>
                    </div>
                    {pendingCount > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-yellow-600">
                        <span>📋</span>
                        <span>{pendingCount} pending request{pendingCount !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <button
                    onClick={() => onStatusChange(t.id)}
                    className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      t.paymentStatus === 'Paid'
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {t.paymentStatus === 'Paid' ? '❌ Mark Unpaid' : '✅ Mark Paid'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}