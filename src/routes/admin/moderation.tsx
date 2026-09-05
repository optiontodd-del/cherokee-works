import { useState } from 'react'

interface PendingJob {
  id: string
  title: string
  company: string
  submitted_at: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function AdminModeration() {
  const [queue] = useState<PendingJob[]>([
    {
      id: '1',
      title: 'Registered Nurse - Emergency Department',
      company: 'Cherokee Medical Center',
      submitted_at: '2026-09-05T10:30:00Z',
      status: 'pending',
    },
    {
      id: '2',
      title: 'HVAC Technician',
      company: 'Climate Control Services',
      submitted_at: '2026-09-04T15:45:00Z',
      status: 'pending',
    },
  ])

  const handleApprove = (jobId: string) => {
    console.log('Approving job:', jobId)
    // TODO: Call API to approve
  }

  const handleReject = (jobId: string) => {
    console.log('Rejecting job:', jobId)
    // TODO: Call API to reject
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Moderation Queue</h1>
        <div className="text-sm text-gray-600">
          <span className="font-bold text-lg text-yellow-600">{queue.filter(j => j.status === 'pending').length}</span> pending review
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Job Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Company</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Submitted</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {queue.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{job.company}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(job.submitted_at).toLocaleDateString()} {new Date(job.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    job.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleApprove(job.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(job.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {queue.filter(j => j.status === 'pending').length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600 text-lg">✓ All job listings reviewed!</p>
        </div>
      )}
    </div>
  )
}
