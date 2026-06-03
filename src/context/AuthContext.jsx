import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('filer_token'))

  const fetchMe = async (tok) => {
    try {
      const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${tok}` } })
      if (res.ok) {
        const data = await res.json()
        if (data.data) {
          setUser(data.data)
          localStorage.setItem('filer_user', JSON.stringify(data.data))
        }
      }
    } catch {}
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('filer_token')
    if (storedToken) {
      // Try to refresh user info from server; fall back to cached value
      fetchMe(storedToken).catch(() => {
        const stored = localStorage.getItem('filer_user')
        if (stored) {
          try { setUser(JSON.parse(stored)) } catch {}
        }
      })
    } else {
      const stored = localStorage.getItem('filer_user')
      if (stored) {
        try { setUser(JSON.parse(stored)) } catch {}
      }
    }
  }, [])

  const login = (authResponse) => {
    setToken(authResponse.token)
    const basicUser = { username: authResponse.username, email: authResponse.email, role: authResponse.role }
    setUser(basicUser)
    localStorage.setItem('filer_token', authResponse.token)
    localStorage.setItem('filer_user', JSON.stringify(basicUser))
    // Fetch full user info (including id) from server
    fetchMe(authResponse.token)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('filer_token')
    localStorage.removeItem('filer_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
