import { useEffect, useState } from 'react'

interface OverviewStats {
  total_views: number
  total_applications: number
  active_listings: number
  total_employers: number
  total_candidates: number
}

interface TrendingItem {
  category?: string
  location?: string
  title?: string
  count?: number
  views?: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<OverviewStats | null>(null)
  const [trending, setTrending] = useState<{ top_categories: TrendingItem[], top_locations: TrendingItem[], most_viewed_jobs: TrendingItem[] }>({ top_categories: [], top_locations: [], most_viewed_jobs: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch('/api/admin-analytics', {
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(),
        method: 'GET',
      })

      if (!response.ok) throw new Error('Failed to load analytics')

      const data = await response.json()
      setStats(data.overview)
      setTrending({
        top_categories: data.trending?.top_categories || [],
        top_locations: data.trending?.top_locations || [],
        most_viewed_jobs: data.trending?.most_viewed_jobs || [],
      })
    } catch (err) {
      console.error('Error loading analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center text-gray-600">Loading analytics...</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to Admin Dashboard</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Views" value={stats?.total_views} icon="👁️" />
        <StatCard label="Applications" value={stats?.total_applications} icon="📝" />
        <StatCard label="Active Listings" value={stats?.active_listings} icon="💼" />
        <StatCard label="Employers" value={stats?.total_employers} icon="🏢" />
        <StatCard label="Candidates" value={stats?.total_candidates} icon="👤" />
      </div>

      {/* Trending Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Top Categories</h2>
          <div className="space-y-3">
            {trending.top_categories.map((item: TrendingItem, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">{item.category}</span>
                <span className="font-bold text-blue-600">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📍 Top Locations</h2>
          <div className="space-y-3">
            {trending.top_locations.map((item: TrendingItem, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">{item.location}</span>
                <span className="font-bold text-blue-600">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Viewed Jobs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🔥 Most Viewed Jobs</h2>
          <div className="space-y-3">
            {trending.most_viewed_jobs.map((item: TrendingItem, idx) => (
              <div key={idx} className="py-2 border-b border-gray-200">
                <p className="text-gray-700 text-sm font-medium line-clamp-2">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">{item.views} views</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ActionButton label="Manage Jobs" href="/admin/jobs" />
          <ActionButton label="Manage Users" href="/admin/users" />
          <ActionButton label="Review Pending" href="/admin/moderation" />
          <ActionButton label="View Analytics" href="/admin/analytics" />
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value?: number
  icon: string
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value || 0}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )
}

interface ActionButtonProps {
  label: string
  href: string
}

function ActionButton({ label, href }: ActionButtonProps) {
  return (
    <a
      href={href}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded text-center transition"
    >
      {label}
    </a>
  )
}
