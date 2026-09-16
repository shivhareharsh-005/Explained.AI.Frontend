import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ identity: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/start-session" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!form.identity.trim() || !form.password) return setError('Enter your email or username and password.')
    setLoading(true)
    try {
      const identity = form.identity.trim()
      await login({ password: form.password, ...(identity.includes('@') ? { email: identity } : { username: identity }) })
      navigate(location.state?.from?.pathname || '/start-session', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <Link to="/" className="text-lg font-extrabold text-slate-900">Concept<span className="text-blue-600">Check</span></Link>
        <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-2 text-slate-600">Continue your learning journey.</p>
        {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <label className="mt-6 block text-sm font-semibold text-slate-700">Email or username<input value={form.identity} onChange={(event) => setForm({ ...form, identity: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" autoComplete="username" /></label>
        <label className="mt-5 block text-sm font-semibold text-slate-700">Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" autoComplete="current-password" /></label>
        <button disabled={loading} className="mt-7 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">{loading ? 'Logging in...' : 'Login'}</button>
        <p className="mt-5 text-center text-sm text-slate-600">New to ConceptCheck? <Link to="/signup" className="font-semibold text-blue-700">Create an account</Link></p>
      </form>
    </main>
  )
}

export default Login
