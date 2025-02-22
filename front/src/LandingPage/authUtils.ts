import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    axios
      .get('/api/auth/check', { withCredentials: true })
      .then((res) => setIsAuthenticated(res.data.loggedIn))
      .catch(() => setIsAuthenticated(false));
  }, []);

  return isAuthenticated;
}

export const useLogout = () => {
  const navigate = useNavigate(); // React Router hook for navigation

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true }); // API Call
      localStorage.removeItem('token'); // Remove token (if stored)
      navigate('/'); // Redirect to Landing Page
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return handleLogout;
};
