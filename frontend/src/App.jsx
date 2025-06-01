import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './pages/layout/Layout';
import MainPage from './pages/mainPage/MainPage';
import VerifyEmailForm from './components/auth/VerifyEmailForm';
import NotFound from './pages/notifications/NotFound';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import AuthForm from './components/authForm/AuthForm';
import { IconConfigProvider } from './context/IconConfigContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const   GuestRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return !isAuthenticated ? children : <Navigate to="/" />;
};

const Logout = () => {
  const { logout } = useContext(AuthContext);
  logout();
  return <Navigate to="/login" />;
};

const RegisterAndLogout = () => {
  const { logout } = useContext(AuthContext);
  logout();
  return <AuthForm method="register" />;
};

function App() {
  return (
    <IconConfigProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <AuthForm method="login" />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <RegisterAndLogout />
              </GuestRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <GuestRoute>
                <VerifyEmailForm />
              </GuestRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </IconConfigProvider>
  );
}

export default App;