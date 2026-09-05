import { useEffect, useState } from 'react'

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null)
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
      })

      if (!response.ok) throw new Error('Failed to load analytics')

      const data = await response.json()
      setStats(data)
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
      <h1 className="text-4xl font-bold text-gray-900">Analytics & Insights</h1>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Total Views" value={stats?.overview?.total_views} color="blue" />
        <StatBox label="Applications" value={stats?.overview?.total_applications} color="green" />
        <StatBox label="Published Jobs" value={stats?.jobs?.published} color="purple" />
        <StatBox label="Pending Review" value={stats?.jobs?.pending_review} color="yellow" />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Jobs Statistics</h2>
          <div className="space-y-4">
            <AnalyticRow label="Total Posted" value={stats?.jobs?.total_posted} />
            <AnalyticRow label="Published" value={stats?.jobs?.published} />
            <AnalyticRow label="Pending Review" value={stats?.jobs?.pending_review} />
            <AnalyticRow label="Rejected" value={stats?.jobs?.rejected} />
          </div>
        </div>

        {/* Application Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Application Analytics</h2>
          <div className="space-y-4">
            <AnalyticRow label="Total Applications" value={stats?.applications?.total} />
            <AnalyticRow label="Last 7 Days" value={stats?.applications?.last_7_days} />
            <AnalyticRow label="Average per Job" value={stats?.applications?.average_per_job} decimals={1} />
          </div>
        </div>

        {/* User Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">User Statistics</h2>
          <div className="space-y-4">
            <AnalyticRow label="Total Candidates" value={stats?.users?.total_candidates} />
            <AnalyticRow label="Total Employers" value={stats?.users?.total_employers} />
            <AnalyticRow label="New This Week" value={stats?.users?.new_this_week} />
            <AnalyticRow label="Active This Week" value={stats?.users?.active_this_week} />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Jobs by Category</h2>
          <div className="space-y-3">
            {Object.entries(stats?.jobs?.by_category || {}).map(([category, count]: [string, any]) => (
              <div key={category} className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">{category}</span>
                <span className="font-bold text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatBoxProps {
  label: string
  value?: number
  color: string
}

function StatBox({ label, value, color }: StatBoxProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-900',
    green: 'bg-green-50 text-green-900',
    purple: 'bg-purple-50 text-purple-900',
    yellow: 'bg-yellow-50 text-yellow-900',
  }

  return (
    <div className={`rounded-lg p-6 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-3xl font-bold mt-2">{value || 0}</p>
    </div>
  )
}

interface AnalyticRowProps {
  label: string
  value?: number
  decimals?: number
}

function AnalyticRow({ label, value, decimals = 0 }: AnalyticRowProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200">
      <span className="text-gray-700">{label}</span>
      <span className="font-bold text-gray-900">
        {value !== undefined ? (decimals > 0 ? value.toFixed(decimals) : value) : '0'}
      </span>
    </div>
  )
}
