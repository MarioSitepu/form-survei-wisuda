import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminSession, clearAdminSession, verifyAdminSession } from '@/lib/auth';
import AdminLogin from '@/components/admin-login';
import AdminDashboard from '@/components/admin-dashboard';

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      const session = getAdminSession();
      if (session) {
        try {
          const isValid = await verifyAdminSession();
          setIsAuthenticated(isValid);
        } catch (error) {
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await clearAdminSession();
    setIsAuthenticated(false);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

