// pages/payment/index.tsx
import Layout from '@/components/Layout'
import PaymentRequestForm from '@/components/PaymentRequestForm'
import PaymentRequestsList from '@/components/PaymentRequestsList'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function PaymentPage() {
  const [activeTab, setActiveTab] = useState<'send' | 'list'>('send')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (router.query.tab === 'list') {
      setActiveTab('list')
    }
    setMounted(true)
  }, [router.query])

  const handleTabChange = (tab: 'send' | 'list') => {
    setActiveTab(tab)
    router.push({
      pathname: router.pathname,
      query: { tab }
    }, undefined, { shallow: true })
  }

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-8 overflow-hidden">
        <div className="px-6 py-8 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-2xl">
                💸
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Payment Management</h1>
                <p className="text-blue-100 mt-1">Send and track payment requests to teachers</p>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <button 
                onClick={() => router.push('/teachers')}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm"
              >
                <span>👤</span>
                <span>View Teachers</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation  */}
        <div className="px-6 sm:px-10 bg-white/10">
          <div className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => handleTabChange('send')}
              className={`relative py-3 px-4 text-sm sm:text-base font-medium transition-all duration-200 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-1 focus:ring-offset-blue-600 ${
                activeTab === 'send' 
                  ? 'text-blue-900 bg-white' 
                  : 'text-white hover:bg-white/10'
              }`}
              aria-current={activeTab === 'send' ? 'page' : undefined}
            >
              <span className="flex items-center space-x-2">
                <span>📤</span>
                <span>Send Request</span>
              </span>
              {activeTab === 'send' && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t"></span>
              )}
            </button>
            <button
              onClick={() => handleTabChange('list')}
              className={`relative py-3 px-4 text-sm sm:text-base font-medium transition-all duration-200 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-1 focus:ring-offset-blue-600 ${
                activeTab === 'list' 
                  ? 'text-blue-900 bg-white' 
                  : 'text-white hover:bg-white/10'
              }`}
              aria-current={activeTab === 'list' ? 'page' : undefined}
            >
              <span className="flex items-center space-x-2">
                <span>📋</span>
                <span>All Requests</span>
              </span>
              {activeTab === 'list' && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content with animation */}
      <div className="min-h-[500px] transition-all duration-300 ease-in-out">
        {!mounted ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="animate-fadeIn">
            {activeTab === 'send' ? (
              <PaymentRequestForm />
            ) : (
              <PaymentRequestsList />
            )}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <span>📬</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Request Process</h3>
              <p className="text-sm text-gray-600 mt-1">Send payment requests directly to teachers' emails</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              <span>🔍</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Track Status</h3>
              <p className="text-sm text-gray-600 mt-1">Monitor pending, approved, and completed payments</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <span>📊</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Payment History</h3>
              <p className="text-sm text-gray-600 mt-1">View complete history of all payment transactions</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

