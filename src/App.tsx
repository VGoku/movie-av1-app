import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Navbar />
      <Box component="main" sx={{ pt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default App; 