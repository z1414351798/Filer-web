import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Zap, BarChart2, Bookmark, Clock, LogIn, LogOut, UserPlus, Activity, FolderOpen } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const navCls = ({ isActive }) =>
    `text-sm px-3 py-1.5 rounded-lg transition-colors ${
      isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-white mr-2">
          <Zap size={20} className="text-indigo-400" />
          Filer
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={navCls}>
            <span className="flex items-center gap-1.5">Convert</span>
          </NavLink>
          <NavLink to="/history" className={navCls}>
            <span className="flex items-center gap-1.5"><Clock size={14} />History</span>
          </NavLink>
          <NavLink to="/stats" className={navCls}>
            <span className="flex items-center gap-1.5"><BarChart2 size={14} />Stats</span>
          </NavLink>
          <NavLink to="/health" className={navCls}>
            <span className="flex items-center gap-1.5"><Activity size={14} />Health</span>
          </NavLink>
          <NavLink to="/files" className={navCls}>
            <span className="flex items-center gap-1.5"><FolderOpen size={14} />Files</span>
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/presets" className={navCls}>
              <span className="flex items-center gap-1.5"><Bookmark size={14} />Presets</span>
            </NavLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-400 hidden sm:block">{user?.username}</span>
              <button
                onClick={() => { logout(); navigate('/') }}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <LogOut size={14} /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <LogIn size={14} /> Sign in
              </Link>
              <Link to="/register" className="btn-primary text-sm px-3 py-1.5 flex items-center gap-1.5">
                <UserPlus size={14} /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
