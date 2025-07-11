
import { useState, useEffect } from 'react'
import { getPaymentRequests, updatePaymentRequest } from '@/lib/storage'
import { PaymentRequest } from '@/types/PaymentRequest'

export default function PaymentRequestsList() {
  const [requests, setRequests] = useState<PaymentRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all')
  const [confirmAction, setConfirmAction] = useState<{id: string, action: 'complete' | 'cancel'} | null>(null)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = () => {
    setIsLoading(true)
    // Simulate network delay for better UX testing
    setTimeout(() => {
      setRequests(getPaymentRequests())
      setIsLoading(false)
    }, 300)
  }

  const handleStatusChange = (id: string, newStatus: PaymentRequest['status']) => {
    updatePaymentRequest(id, { status: newStatus })
    setConfirmAction(null)
    loadRequests()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: PaymentRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getStatusIcon = (status: PaymentRequest['status']) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'completed': return '✅'
      case 'cancelled': return '❌'
    }
  }

  const filteredRequests = activeFilter === 'all' 
    ? requests 
    : requests.filter(request => request.status === activeFilter)

  // Stats calculation
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    completed: requests.filter(r => r.status === 'completed').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length,
    totalAmount: requests.reduce((sum, r) => sum + r.amount, 0).toFixed(2)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading payment requests...</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center text-center h-64">
        <div className="text-5xl mb-4">📋</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Payment Requests Yet</h3>
        <p className="text-gray-500 max-w-md">
          When you send payment requests to teachers, they will appear here. Use the "Send Request" tab to create your first payment request.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Requests</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
              📊
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-xl">
              ⏳
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
              ✅
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">${stats.totalAmount}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
              💰
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'all' 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({stats.total})
            </button>
            <button 
              onClick={() => setActiveFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button 
              onClick={() => setActiveFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'completed' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({stats.completed})
            </button>
            <button 
              onClick={() => setActiveFilter('cancelled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'cancelled' 
                  ? 'bg-red-100 text-red-800 border border-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelled ({stats.cancelled})
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search requests..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-60"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      {request.teacherName.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{request.teacherName}</div>
                      <div className="text-sm text-gray-500">{request.teacherEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${request.amount.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(request.requestDate)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate">{request.description || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                    <span className="mr-1">{getStatusIcon(request.status)}</span>
                    <span className="capitalize">{request.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setConfirmAction({id: request.id, action: 'complete'})}
                        className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-lg px-3 py-1 transition-colors"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => setConfirmAction({id: request.id, action: 'cancel'})}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-lg px-3 py-1 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {request.status !== 'pending' && (
                    <span className="text-gray-400">No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg font-semibold">
                  {request.teacherName.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{request.teacherName}</p>
                  <p className="text-xs text-gray-500">{request.teacherEmail}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                <span className="mr-1">{getStatusIcon(request.status)}</span>
                <span className="capitalize">{request.status}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-sm font-semibold">${request.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm">{formatDate(request.requestDate)}</p>
              </div>
            </div>

            {request.description && (
              <div className="mb-4">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm">{request.description}</p>
              </div>
            )}

            {request.status === 'pending' && (
              <div className="flex space-x-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setConfirmAction({id: request.id, action: 'complete'})}
                  className="flex-1 text-center text-green-600 bg-green-50 hover:bg-green-100 font-medium rounded-lg px-3 py-2 text-sm transition-colors"
                >
                  Complete
                </button>
                <button
                  onClick={() => setConfirmAction({id: request.id, action: 'cancel'})}
                  className="flex-1 text-center text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-lg px-3 py-2 text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mb-4">
                {confirmAction.action === 'complete' ? '✅' : '❌'}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {confirmAction.action === 'complete' ? 'Complete Payment Request?' : 'Cancel Payment Request?'}
              </h3>
              <p className="text-gray-500">
                {confirmAction.action === 'complete' 
                  ? 'This will mark the payment request as completed. This action cannot be undone.'
                  : 'This will cancel the payment request. This action cannot be undone.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setConfirmAction(null)}
                className="w-full sm:w-1/2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                No, Cancel
              </button>
              <button
                onClick={() => handleStatusChange(
                  confirmAction.id, 
                  confirmAction.action === 'complete' ? 'completed' : 'cancelled'
                )}
                className={`w-full sm:w-1/2 px-6 py-3 rounded-xl transition-all duration-300 font-medium text-white ${
                  confirmAction.action === 'complete'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Yes, {confirmAction.action === 'complete' ? 'Complete' : 'Cancel'} It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}