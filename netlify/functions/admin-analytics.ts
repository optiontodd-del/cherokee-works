import { Context } from '@netlify/functions'

export default async (req: Request, context: Context) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors })
  }

  if (req.method === 'GET') {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...cors } }
      )
    }

    // Return mock analytics data
    return new Response(
      JSON.stringify({
        overview: {
          total_views: 1250,
          total_applications: 89,
          active_listings: 34,
          total_employers: 12
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...cors } }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: { 'Content-Type': 'application/json', ...cors } }
  )
}
