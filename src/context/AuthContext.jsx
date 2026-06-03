import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('filer_token'))

  useEffect(() => {
    const stored = localStorage.getItem('filer_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
  }, [])

  const login = (authResponse) => {
    setToken(authResponse.token)
    setUser({ username: authResponse.username, email: authResponse.email, role: authResponse.role })
    localStorage.setItem('filer_token', authResponse.token)
    localStorage.setItem('filer_user', JSON.stringify({
      username: authResponse.username,
      email: authResponse.email,
      role: authResponse.role
    }))
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
