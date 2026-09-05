import { Context } from '@netlify/functions'
import crypto from 'crypto'

// In-memory session store (for demo; use database in production)
const sessions = new Map<string, { email: string; expires: number }>()

export default async (req: Request, context: Context) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors })
  }

  if (req.method === 'POST') {
    const body = await req.json() as { action: string; email: string; password: string }
    const { action, email, password } = body

    if (action === 'login') {
      const adminEmail = process.env.ADMIN_EMAIL
      const adminHash = process.env.ADMIN_PASSWORD_HASH

      const passwordHash = crypto.createHash('sha256').update(password).digest('hex')

      if (email === adminEmail && passwordHash === adminHash) {
        const token = crypto.randomBytes(32).toString('hex')
        const expires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        sessions.set(token, { email, expires })

        return new Response(
          JSON.stringify({ token, email, message: 'Login successful' }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...cors } }
        )
      }

      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...cors } }
      )import { Context } from '@netlify/functions'
import crypto from 'crypto'

const sessions = new Map<string, { email: string; expires: number }>()

export default async (req: Request, context: Context) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors })
  }

  if (req.method === 'POST') {
    const body = await req.json() as { action: string; email: string; password: string }
    const { action, email, password } = body

    if (action === 'login') {
      const adminEmail = process.env.ADMIN_EMAIL
      const adminHash = process.env.ADMIN_PASSWORD_HASH
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex')

      if (email === adminEmail && passwordHash === adminHash) {
        const token = crypto.randomBytes(32).toString('hex')
        const expires = Date.now() + 24 * 60 * 60 * 1000
        sessions.set(token, { email, expires })

        return new Response(
          JSON.stringify({ token, email, message: 'Login successful' }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...cors } }
        )
      }

      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...cors } }
      )
    }

    if (action === 'logout') {
      const token = req.headers.get('authorization')?.replace('Bearer ', '')
      if (token) sessions.delete(token)
      return new Response(
        JSON.stringify({ message: 'Logged out' }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...cors } }
      )
    }

    if (action === 'session') {
      const token = req.headers.get('authorization')?.replace('Bearer ', '')
      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { 'Content-Type': 'application/json', ...cors } }
        )
      }

      const session = sessions.get(token)
      if (!session || session.expires < Date.now()) {
        sessions.delete(token)
        return new Response(
          JSON.stringify({ error: 'Session expired' }),
          { status: 401, headers: { 'Content-Type': 'application/json', ...cors } }
        )
      }

      return new Response(
        JSON.stringify({ user: { email: session.email, id: 'admin', role: 'admin' } }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...cors } }
      )
    }
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: { 'Content-Type': 'application/json', ...cors } }
  )
}
    }

    if (action === 'logout') {
      const token = req.headers.get('authorization')?.replace('Bearer ', '')
      if (token) netlify/functions/admin-auth.tssessions.delete(token)
      return new Response(
        JSON.stringify({ message: 'Logged out' }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...cors } }
      )
    }

    if (action === 'session') {
      const token = req.headers.get('authorization')?.replace('Bearer ', '')
      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { 'Content-Type': 'application/json', ...cors } }
        )
      }

      const session = sessions.get(token)
      if (!session || session.expires < Date.now()) {
        sessions.delete(token)
        return new Response(
          JSON.stringify({ error: 'Session expired' }),
          { status: 401, headers: { 'Content-Type': 'application/json', ...cors } }
        )
      }

      return new Response(
        JSON.stringify({ user: { email: session.email, id: 'admin', role: 'admin' } }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...cors } }
      )
    }
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: { 'Content-Type': 'application/json', ...cors } }
  )
}
