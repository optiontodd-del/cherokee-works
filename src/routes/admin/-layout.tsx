import { Outlet, useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

interface AdminUser {
  id: string
  email: string
  name?: string
  role: string
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate({ to: '/admin/login' })
      return
    }

    try {
      const response = await fetch('/api/admin-auth', {
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'session' }),
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Auth failed')
      }

      const data = await response.json()
      setUser(data.user)
    } catch (err) {
      localStorage.removeItem('admin_token')
      navigate({ to: '/admin/login' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'logout' }),
      })
    }
    localStorage.removeItem('admin_token')
    navigate({ to: '/admin/login' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-800">
          <h1 className={`font-bold ${sidebarOpen ? 'text-xl' : 'text-sm'}`}>
            {sidebarOpen ? 'CherokeeWorks' : 'CW'}
          </h1>
          <p className={`text-xs text-gray-400 ${!sidebarOpen && 'hidden'}`}>Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/admin/dashboard" label="Dashboard" icon="📊" open={sidebarOpen} />
          <NavLink to="/admin/jobs" label="Job Listings" icon="💼" open={sidebarOpen} />
          <NavLink to="/admin/users" label="Users" icon="👥" open={sidebarOpen} />
          <NavLink to="/admin/moderation" label="Moderation" icon="✓" open={sidebarOpen} />
          <NavLink to="/admin/analytics" label="Analytics" icon="📈" open={sidebarOpen} />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full p-2 hover:bg-gray-800 rounded mb-2"
            title="Toggle sidebar"
          >
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-8 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

interface NavLinkProps {
  to: string
  label: string
  icon: string
  open: boolean
}

function NavLink({ to, label, icon, open }: NavLinkProps) {
  const router = useRouter()
  const isActive = router.state.location.pathname === to

  return (
    <a
      href={to}
      className={`block p-3 rounded transition ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'hover:bg-gray-800 text-gray-300'
      }`}
      title={label}
    >
      <span className="text-lg">{icon}</span>
      {open && <span className="ml-3">{label}</span>}
    </a>
  )
}
