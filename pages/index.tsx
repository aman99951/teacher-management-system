
import Layout from '@/components/Layout'
import { useEffect, useState } from 'react'
import { getTeachers, getPaymentRequests } from '@/lib/storage'
import Link from 'next/link'
import { FiUsers, FiClock, FiBarChart2, FiCheck, FiActivity } from 'react-icons/fi'
import { BsCashStack, BsGraphUp, BsCreditCard2Front, BsShieldCheck } from 'react-icons/bs'
import { HiOutlineDocumentText, HiOutlinePlusCircle } from 'react-icons/hi'
import { IoWarningOutline, IoTimeOutline, IoBulbOutline } from 'react-icons/io5'
import { RiArrowRightSLine, RiAddCircleLine } from 'react-icons/ri'
import { MdDone, MdOutlineAttachMoney } from 'react-icons/md'
import { BiTrophy } from 'react-icons/bi'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    paidTeachers: 0,
    unpaidTeachers: 0,
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalPendingAmount: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
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
      setIsLoading(false)
    }, 600)
  }, [])

  const statCards = [
    { 
      label: 'Total Teachers', 
      value: stats.totalTeachers, 
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      icon: <FiUsers className="h-6 w-6" />,
      trend: '+12%',
      trendUp: true
    },
    { 
      label: 'Paid Teachers', 
      value: stats.paidTeachers, 
      color: 'from-emerald-500 to-emerald-700',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      icon: <MdDone className="h-6 w-6" />,
      trend: '+8%',
      trendUp: true
    },
    { 
      label: 'Unpaid Teachers', 
      value: stats.unpaidTeachers, 
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      icon: <FiClock className="h-6 w-6" />,
      trend: '-5%',
      trendUp: false
    },
    { 
      label: 'Pending Requests', 
      value: stats.pendingRequests, 
      color: 'from-amber-500 to-amber-700',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      icon: <HiOutlineDocumentText className="h-6 w-6" />,
      trend: '+3%',
      trendUp: true
    },
    { 
      label: 'Completed Payments', 
      value: stats.completedRequests, 
      color: 'from-violet-500 to-violet-700',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-700',
      icon: <BsCashStack className="h-6 w-6" />,
      trend: '+15%',
      trendUp: true
    },
    { 
      label: 'Pending Amount', 
      value: `$${stats.totalPendingAmount.toFixed(2)}`, 
      color: 'from-indigo-500 to-indigo-700',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      icon: <BsCreditCard2Front className="h-6 w-6" />,
      trend: '+7%',
      trendUp: true
    },
  ]

  const quickActions = [
    {
      title: 'Add New Teacher',
      href: '/teachers/add',
      color: 'from-blue-600 to-blue-800',
      icon: <RiAddCircleLine className="h-6 w-6" />,
      description: 'Register a new teacher in the system'
    },
    {
      title: 'Send Payment Request',
      href: '/payment',
      color: 'from-emerald-600 to-emerald-800',
      icon: <MdOutlineAttachMoney className="h-6 w-6" />,
      description: 'Create and send payment requests to teachers'
    },
    {
      title: 'View All Teachers',
      href: '/teachers',
      color: 'from-slate-600 to-slate-800',
      icon: <FiUsers className="h-6 w-6" />,
      description: 'Browse and manage your teacher list'
    }
  ]

  const activities = [
    {
      icon: <HiOutlinePlusCircle className="h-5 w-5" />,
      title: 'New teacher added',
      description: 'John Doe joined the system',
      time: '2 hours ago',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      icon: <BsCashStack className="h-5 w-5" />,
      title: 'Payment completed',
      description: '$2,500 paid to Sarah Johnson',
      time: '4 hours ago',
      color: 'bg-emerald-100 text-emerald-700'
    },
    {
      icon: <HiOutlineDocumentText className="h-5 w-5" />,
      title: 'Payment request sent',
      description: 'Request sent to Mike Wilson',
      time: '6 hours ago',
      color: 'bg-amber-100 text-amber-700'
    }
  ]

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4 mb-8"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 h-32"></div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className="xl:col-span-2 bg-white rounded-xl shadow-sm p-6 h-64"></div>
              <div className="bg-white rounded-xl shadow-sm p-6 h-64"></div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 h-48"></div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg mb-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjUiPjxwYXRoIGQ9Ik0yOS41IDE4LjVsMTMgNy41LTEzIDcuNS0xMy03LjV6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-center"></div>
          </div>
          <div className="relative px-6 py-10 sm:px-10 sm:py-12 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
                  Dashboard Overview
                </h1>
                <p className="text-blue-100 max-w-2xl">
                  Welcome back! Here's what's happening with your teacher payment management system today.
                </p>
              </div>
              <div className="flex gap-3">
                <Link 
                  href="/teachers/add" 
                  className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <HiOutlinePlusCircle className="h-5 w-5 mr-2" />
                  New Teacher
                </Link>
                <Link 
                  href="/payment" 
                  className="inline-flex items-center px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <BsCreditCard2Front className="h-5 w-5 mr-2" />
                  New Payment
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-4 sm:px-6 lg:px-8 pb-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {statCards.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 -m-6 bg-gradient-to-br opacity-10 rounded-full transform group-hover:scale-110 transition-transform duration-500"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm bg-gradient-to-br ${stat.color} transform group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <span className={`text-sm font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-red-600'} ${stat.trendUp ? 'bg-emerald-50' : 'bg-red-50'} px-2 py-1 rounded-full flex items-center`}>
                    {stat.trendUp ? (
                      <BsGraphUp className="w-3 h-3 mr-1" />
                    ) : (
                      <IoWarningOutline className="w-3 h-3 mr-1" />
                    )}
                    {stat.trend}
                  </span>
                </div>
                <p className={`text-sm font-medium ${stat.textColor} mb-1`}>{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FiBarChart2 className="h-5 w-5 mr-2 text-blue-600" />
                    Quick Actions
                  </h2>
                  <Link 
                    href="/settings" 
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    More Options
                    <RiArrowRightSLine className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <Link 
                      key={index}
                      href={action.href} 
                      className="group flex flex-col h-full"
                    >
                      <div className="bg-gradient-to-br h-full flex flex-col rounded-xl p-5 text-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-y-[-2px] group-hover:shadow-lg relative overflow-hidden border border-transparent hover:border-white/10 from-blue-600 to-blue-800"
                        style={{
                          backgroundImage: `linear-gradient(to bottom right, ${action.color.split(' ')[0].replace('from-', '')}, ${action.color.split(' ')[1].replace('to-', '')})`
                        }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 -m-8 bg-white opacity-10 rounded-full transform group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                          {action.icon}
                        </div>
                        <h3 className="font-semibold text-lg truncate mb-2">
                          {action.title}
                        </h3>
                        <p className="text-sm text-white/80 mt-auto">
                          {action.description}
                        </p>
                        <div className="mt-4 flex items-center text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                          <span>Get Started</span>
                          <RiArrowRightSLine className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* System Overview */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
                <div className="border-b border-gray-100 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BsShieldCheck className="h-5 w-5 mr-2 text-indigo-600" />
                    System Overview
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white shadow-sm">
                      <FiActivity className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">System Status</p>
                      <div className="flex items-center mt-1">
                        <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                        <span className="text-xs text-gray-600 ml-1.5">All systems operational</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center text-white shadow-sm">
                      <BsGraphUp className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">This Month</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-600">15 payments processed</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-violet-50 rounded-lg border border-violet-100 hover:bg-violet-100 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-700 rounded-lg flex items-center justify-center text-white shadow-sm">
                      <BiTrophy className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Achievement</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-600">100% payment accuracy</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-6">
                  <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 -m-8 bg-white opacity-10 rounded-full"></div>
                    <p className="text-sm font-medium mb-2 flex items-center">
                      <IoBulbOutline className="h-5 w-5 mr-1.5" />
                      Pro Tip
                    </p>
                    <p className="text-xs leading-relaxed text-white/90 relative z-10">
                      Use bulk payment requests to save time when processing multiple teacher payments at once.
                    </p>
                    <button className="mt-3 text-xs bg-white/20 hover:bg-white/30 text-white rounded-lg px-3 py-1.5 flex items-center transition-colors">
                      Learn More
                      <RiArrowRightSLine className="h-3.5 w-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <IoTimeOutline className="h-5 w-5 mr-2 text-blue-600" />
                Recent Activity
              </h2>
              <Link 
                href="/activity" 
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View All
                <RiArrowRightSLine className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {activities.map((activity, index) => (
                <div 
                  key={index} 
                  className="p-6 flex items-start space-x-4 hover:bg-gray-50 transition-colors"
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <button className="w-full py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center">
                Load More Activities
                <RiArrowRightSLine className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}