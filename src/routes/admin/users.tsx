import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

interface User {
  id: string
  email: string
  name: string
  type: 'candidate' | 'employer'
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  last_login?: string
}

function AdminUsers() {
  const [users] = useState<User[]>([
    {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      type: 'candidate',
      status: 'active',
      created_at: '2026-08-15T10:30:00Z',
      last_login: '2026-09-05T14:22:00Z',
    },
    {
      id: '2',
      email: 'acme.corp@example.com',
      name: 'ACME Corporation',
      type: 'employer',
      status: 'active',
      created_at: '2026-08-20T09:15:00Z',
      last_login: '2026-09-04T16:45:00Z',
    },
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">User Management</h1>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Login</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.type === 'employer' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.type === 'employer' ? '🏢 Employer' : '👤 Candidate'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                    Edit
                  </button>
                  <button className="text-orange-600 hover:text-orange-800 font-medium text-xs">
                    Suspend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/admin/users')({
  component: AdminUsers,
})
