import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppRoutes from './Routes/Routes.jsx';
import './index.css';

// Crie um tema personalizado com Material-UI
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
    },
});

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <AppRoutes />
        </ThemeProvider>
    </StrictMode>,
);
