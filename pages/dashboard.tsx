// pages/dashboard.tsx
import Layout from '@/components/Layout'
import { useEffect, useState } from 'react'
import { getTeachers, getPaymentRequests } from '@/lib/storage'
import Link from 'next/link'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    paidTeachers: 0,
    unpaidTeachers: 0,
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalPendingAmount: 0
  })

  useEffect(() => {
    const teachers = getTeachers()
    const requests = getPaymentRequests()

    const paidTeachers = teachers.filter(t => t.paymentStatus === 'Paid').length
    const pendingRequests = requests.filter(r => r.status === 'pending')
    const completedRequests = requests.filter(r => r.status === 'completed')
    const totalPendingAmount = pendingRequests.reduce((sum, r) => sum + r.amount, 0)

    setStats({
      totalTeachers: teachers.length,
      paidTeachers,
      unpaidTeachers: teachers.length - paidTeachers,
      totalRequests: requests.length,
      pendingRequests: pendingRequests.length,
      completedRequests: completedRequests.length,
      totalPendingAmount
    })
  }, [])

  const statCards = [
    { label: 'Total Teachers', value: stats.totalTeachers, color: 'bg-blue-500' },
    { label: 'Paid Teachers', value: stats.paidTeachers, color: 'bg-green-500' },
    { label: 'Unpaid Teachers', value: stats.unpaidTeachers, color: 'bg-red-500' },
    { label: 'Pending Requests', value: stats.pendingRequests, color: 'bg-yellow-500' },
    { label: 'Completed Payments', value: stats.completedRequests, color: 'bg-purple-500' },
    { label: 'Pending Amount', value: `$${stats.totalPendingAmount.toFixed(2)}`, color: 'bg-indigo-500' },
  ]

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className={`w-12 h-12 ${stat.color} rounded-lg mb-4`}></div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/teachers/add" className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700">
              Add New Teacher
            </Link>
            <Link href="/payment" className="block w-full bg-green-600 text-white text-center py-2 rounded hover:bg-green-700">
              Send Payment Request
            </Link>
            <Link href="/teachers" className="block w-full bg-gray-600 text-white text-center py-2 rounded hover:bg-gray-700">
              View All Teachers
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">System Overview</h2>
          <div className="space-y-2 text-sm">
            <p>Welcome to the Teacher Management System</p>
            <p className="text-gray-600">Manage teachers, track payments, and send payment requests all in one place.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}