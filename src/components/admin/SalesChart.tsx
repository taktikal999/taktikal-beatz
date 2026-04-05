'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Calendar } from 'lucide-react'

interface SalesData {
  date: string
  revenue: number
  orders: number
}

export default function SalesChart() {
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSalesData()
  }, [timeRange])

  const fetchSalesData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/admin/sales?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSalesData(data)
      }
    } catch (error) {
      console.error('Failed to fetch sales data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (timeRange === '7d') {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else if (timeRange === '30d') {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    }
    return date.toLocaleDateString('en-US', { month: 'short' })
  }

  const maxRevenue = Math.max(...salesData.map(d => d.revenue), 1)
  const maxOrders = Math.max(...salesData.map(d => d.orders), 1)

  const timeRanges = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: '1Y', value: '1y' },
  ]

  if (loading) {
    return (
      <div className="card">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-64 bg-gray-100 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Sales Overview</h3>
          <p className="text-gray-600 text-sm">Revenue and orders over time</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === range.value 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Orders</span>
          </div>
        </div>
        
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end">
            {salesData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center justify-end">
                <div className="w-3/4 flex items-end space-x-1">
                  <div 
                    className="w-full bg-primary-600 rounded-t-lg transition-all duration-300"
                    style={{ height: `${(data.revenue / maxRevenue) * 80}%` }}
                  ></div>
                  <div 
                    className="w-full bg-green-500 rounded-t-lg transition-all duration-300"
                    style={{ height: `${(data.orders / maxOrders) * 80}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {formatDate(data.date)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-gray-400">
            <div>{formatCurrency(maxRevenue)}</div>
            <div>{formatCurrency(0)}</div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-lg font-semibold">
              {formatCurrency(salesData.reduce((sum, d) => sum + d.revenue, 0))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-lg font-semibold">
              {salesData.reduce((sum, d) => sum + d.orders, 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Avg. Order Value</p>
            <p className="text-lg font-semibold">
              {formatCurrency(
                salesData.reduce((sum, d) => sum + d.revenue, 0) / 
                Math.max(salesData.reduce((sum, d) => sum + d.orders, 0), 1)
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}