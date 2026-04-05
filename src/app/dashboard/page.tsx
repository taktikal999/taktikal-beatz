'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, ShoppingBag, Download, Heart, Settings, LogOut, 
  Package, CreditCard, Bell, Music, Calendar, Star, Eye
} from 'lucide-react'

interface UserData {
  id: string
  email: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

interface Purchase {
  id: string
  beat_title: string
  amount: number
  status: string
  created_at: string
  download_url: string | null
}

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        router.push('/login')
        return
      }

      const data = await response.json()
      setUser(data.user)
      fetchPurchases(token)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchPurchases = async (token: string) => {
    try {
      const response = await fetch('/api/user/purchases', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPurchases(data)
      }
    } catch (error) {
      console.error('Failed to fetch purchases:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.push('/')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Music className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold">My Account</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="card">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || user.email}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user?.full_name || user?.username || user?.email.split('@')[0]}
                    </h3>
                    <p className="text-gray-600 text-sm">{user?.email}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Member since {user?.created_at ? formatDate(user.created_at) : 'recently'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                        activeTab === item.id 
                          ? 'bg-primary-50 text-primary-700' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-4">Account Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Purchases</span>
                    <span className="font-semibold">{purchases.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-semibold">
                      {formatCurrency(purchases.reduce((sum, p) => sum + p.amount, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Downloads</span>
                    <span className="font-semibold">
                      {purchases.filter(p => p.download_url).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-2xl font-bold mb-6">Welcome back!</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-primary-50 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <ShoppingBag className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{purchases.length}</div>
                          <div className="text-sm text-gray-600">Purchases</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-green-50 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Download className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {purchases.filter(p => p.download_url).length}
                          </div>
                          <div className="text-sm text-gray-600">Downloads</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-purple-50 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Star className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">0</div>
                          <div className="text-sm text-gray-600">Favorites</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Recent Purchases</h3>
                    <button 
                      onClick={() => setActiveTab('purchases')}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      View All →
                    </button>
                  </div>
                  
                  {purchases.length === 0 ? (
                    <div className="py-12 text-center">
                      <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No purchases yet</p>
                      <p className="text-gray-500 text-sm mt-1">Start shopping to see your purchases here</p>
                      <button 
                        onClick={() => router.push('/store')}
                        className="mt-4 btn-primary"
                      >
                        Browse Beats
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {purchases.slice(0, 5).map((purchase) => (
                        <div key={purchase.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-primary-100 rounded-lg">
                              <Music className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <div className="font-medium">{purchase.beat_title}</div>
                              <div className="text-sm text-gray-600">
                                {formatDate(purchase.created_at)} • {formatCurrency(purchase.amount)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              purchase.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {purchase.status}
                            </span>
                            
                            {purchase.download_url && (
                              <button className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'purchases' && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-6">Purchase History</h3>
                
                {purchases.length === 0 ? (
                  <div className="py-12 text-center">
                    <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No purchases yet</p>
                    <button 
                      onClick={() => router.push('/store')}
                      className="mt-4 btn-primary"
                    >
                      Browse Beats
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Beat</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.map((purchase) => (
                          <tr key={purchase.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="font-medium">{purchase.beat_title}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm text-gray-600">
                                {formatDate(purchase.created_at)}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold">
                                {formatCurrency(purchase.amount)}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                purchase.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {purchase.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                {purchase.download_url && (
                                  <button 
                                    className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                                    title="Download"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                )}
                                <button 
                                  className="p-1 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-6">Account Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Profile Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.full_name || ''}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={user?.email || ''}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="font-medium mb-4">Security</h4>
                    <button className="btn-primary">
                      Change Password
                    </button>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="font-medium mb-4">Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                        <span className="text-sm text-gray-700">Email notifications for new beats</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                        <span className="text-sm text-gray-700">Promotional emails</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                        <span className="text-sm text-gray-700">Order updates</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <button className="bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 rounded-lg font-medium">
                      Delete Account
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      This action cannot be undone. All your data will be permanently removed.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}