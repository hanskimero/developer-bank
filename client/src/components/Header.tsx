import React, {SetStateAction, Dispatch} from 'react';
import { AppBar, Toolbar, IconButton, Typography, Link, Switch } from '@mui/material';
import { Login, Logout, PersonAdd, AccountCircle } from '@mui/icons-material';
import { Link as RouterLink, useNavigate, NavigateFunction } from 'react-router-dom';
import { useTheme } from '../themeContext';

interface Props {
  token : string | null
  devId : string | null
  setToken : Dispatch<SetStateAction<string | null>>
  setDevId : Dispatch<SetStateAction<string | null>>
  username : string | null
  setUsername : Dispatch<SetStateAction<string | null>>
}

const Header: React.FC<Props> = (props : Props) => {

  const { darkMode, toggleDarkMode } = useTheme();

  const navigate : NavigateFunction = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    props.setToken(null);
    props.setDevId(null);
    props.setUsername(null);

    navigate("/");
  }
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          DevBank
        </Typography>
        <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              name="themeSwitch"
              inputProps={{ 'aria-label': 'toggle theme' }}
            />

        {/* Ternary to conditionally render Login or Logout icon */}
        {props.token === null ? (
          <>
          <Link component={RouterLink} to="/register" color="inherit" sx={{ marginRight: 2 }}>
          <IconButton color="inherit">
            <PersonAdd />
          </IconButton>
        </Link>
          <Link component={RouterLink} to="/login" color="inherit" sx={{ marginRight: 2 }}>
            <IconButton color="inherit">
              <Login />
            </IconButton>
          </Link>
          </>
        ) : (
          <>
          <Typography variant="subtitle1" color="inherit" sx={{ marginRight: 2 }}>
              Logged in as: {props.username}
            </Typography>
            <Link component={RouterLink} to={`/edit/${props.devId}`} color="inherit" sx={{ marginRight: 2 }}>
              <IconButton color="inherit">
                <AccountCircle />
              </IconButton>
            </Link>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
          </>
        )}
        
      </Toolbar>
    </AppBar>
  );
};

export default Header;
