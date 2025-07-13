import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { QuestionProvider } from './contexts/QuestionContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Questions from './pages/Questions'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import QuestionDetail from './pages/QuestionDetail'
import QuestionsList from './pages/QuestionsList'
import Admin from './pages/Admin'
import Revisoes from './pages/Revisoes'
import AdminUsers from './pages/AdminUsers'

console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

function App() {
  return (
    <AuthProvider>
      <QuestionProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/questions/list" element={<QuestionsList />} />
            <Route path="/question/:id" element={<QuestionDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/revisoes" element={<Revisoes />} />
          </Routes>
        </Layout>
      </QuestionProvider>
    </AuthProvider>
  )
}

export default App 