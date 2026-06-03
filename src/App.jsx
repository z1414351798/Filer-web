import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import StatsPage from './pages/StatsPage'
import PresetsPage from './pages/PresetsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HealthPage from './pages/HealthPage'
import FileManagerPage from './pages/FileManagerPage'
import JobHistoryPage from './pages/JobHistoryPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage   from './pages/AdminPage'
import ApiKeysPage from './pages/ApiKeysPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/presets" element={<PresetsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="health" element={<HealthPage />} />
            <Route path="files" element={<FileManagerPage />} />
            <Route path="jobs"  element={<JobHistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="admin"   element={<AdminPage />} />
            <Route path="apikeys" element={<ApiKeysPage />} />
          </Routes>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{ style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' } }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}
