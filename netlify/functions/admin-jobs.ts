import { Context } from '@netlify/functions'

export default async (req: Request, context: Context) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors })
  }

  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json', ...cors } }
    )
  }

  if (req.method === 'GET') {
    // Return mock job listings
    return new Response(
      JSON.stringify({
        jobs: [
          { id: '1', title: 'Software Engineer', company: 'TechCorp', status: 'published' },
          { id: '2', title: 'Product Manager', company: 'StartupXYZ', status: 'pending' }
        ]
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...cors } }
    )
  }

  if (req.method === 'POST') {
    // Create new job
    return new Response(
      JSON.stringify({ message: 'Job created', id: 'new-job-id' }),
      { status: 201, headers: { 'Content-Type': 'application/json', ...cors } }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: { 'Content-Type': 'application/json', ...cors } }
  )
}
