import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button
      variant="outlined"
      onClick={handleLogout}
      sx={{
        position: 'relative',
        bottom: 0,
        marginTop: 'auto',
        color: '#000',
        borderColor: '#000',
        borderRadius: '20px',
        width: '80%',
        '&:hover': {
          borderColor: '#000',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
