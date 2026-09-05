import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

interface Job {
  id: string
  title: string
  company_id: string
  location: string
  category: string
  status: string
  created_at: string
  view_count?: number
}

function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    company_id: '',
    location: '',
    category: '',
    description: '',
    job_type: 'full-time',
  })

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch('/api/admin-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error('Failed to load jobs')

      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (err) {
      console.error('Error loading jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch('/api/admin-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to create job')

      const newJob = await response.json()
      setJobs([...jobs, newJob])
      setFormData({ title: '', company_id: '', location: '', category: '', description: '', job_type: 'full-time' })
      setShowForm(false)
    } catch (err) {
      console.error('Error creating job:', err)
    }
  }

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch(`/api/admin-jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error('Failed to delete job')

      setJobs(jobs.filter(j => j.id !== jobId))
    } catch (err) {
      console.error('Error deleting job:', err)
    }
  }

  const handlePublish = async (jobId: string) => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch(`/api/admin-jobs/${jobId}/publish`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error('Failed to publish job')

      const updated = await response.json()
      setJobs(jobs.map(j => j.id === jobId ? updated : j))
    } catch (err) {
      console.error('Error publishing job:', err)
    }
  }

  if (loading) {
    return <div className="text-center text-gray-600">Loading jobs...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Job Listings</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          {showForm ? 'Cancel' : '+ New Job'}
        </button>
      </div>

      {/* Create Job Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Job</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Job Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="text"
                placeholder="Company ID"
                value={formData.company_id}
                onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Category</option>
                <option value="healthcare">Healthcare & Nursing</option>
                <option value="trades">Skilled Trades & Construction</option>
                <option value="manufacturing">Manufacturing & Production</option>
                <option value="transportation">Transportation & Warehousing</option>
              </select>
            </div>
            <textarea
              placeholder="Job Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows={4}
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
            >
              Create Job
            </button>
          </form>
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Job Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Views</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{job.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{job.location}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{job.category}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    job.status === 'published' ? 'bg-green-100 text-green-800' :
                    job.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{job.view_count || 0}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  {job.status !== 'published' && (
                    <button
                      onClick={() => handlePublish(job.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                    >
                      Publish
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-600 hover:text-red-800 font-medium text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No jobs yet. Create your first job listing!</p>
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/admin/jobs')({
  component: AdminJobs,
})
