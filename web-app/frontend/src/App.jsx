import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/auth-context.jsx';
import { Header } from './components/header.jsx';
import { ProtectedRoute } from './components/protected-route.jsx';
import { LoginPage } from './pages/login-page.jsx';
import { DashboardPage } from './pages/dashboard-page.jsx';
import { ProfilePage } from './pages/profile-page.jsx';
import { UserManagementPage } from './pages/user-management-page.jsx';
import { UserFormPage } from './pages/user-form-page.jsx';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <UserManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/users/new"
                element={
                  <ProtectedRoute>
                    <UserFormPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/users/:id"
                element={
                  <ProtectedRoute>
                    <UserFormPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
