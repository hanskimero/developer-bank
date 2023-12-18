
import { createTheme } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: deepPurple,
    background: {
      default: '#121212', // Dark background color for the entire app
      paper: '#1E1E1E', // Dark background color for paper components
    },
    text: {
      primary: '#ffffff', // White text color
      secondary: '#B0B0B0', // Light gray text color for secondary text
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', // Set the desired font family
    h1: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#ffffff', // White color for heading text
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#ffffff',
    },
    
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212', 
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212', 
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212', 
        },
      }
    }
  },
 
});

export default darkTheme;
