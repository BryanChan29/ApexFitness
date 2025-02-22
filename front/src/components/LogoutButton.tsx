import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      navigate('/'); // Redirect to Landing Page
      window.location.reload(); // Refresh to update auth state
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button
      variant="outlined"
      onClick={handleLogout}
      sx={{
        position: 'absolute',
        top: 15,
        right: 20,
        color: 'white',
        borderColor: 'white',
        '&:hover': {
          borderColor: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
