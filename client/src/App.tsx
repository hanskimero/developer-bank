import React, { useState } from 'react';
import { Container, CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Start from './components/Start';
import DeveloperPage from './components/DeveloperPage';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import DeveloperEdit from './components/DeveloperEdit';
import EditProfile from './components/EditProfile';
import AddProject from './components/AddProject';
import { ThemeProvider } from './themeContext';

const App : React.FC = () : React.ReactElement => {

  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState<boolean>(false);

  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState<string | null>(storedToken !== null ? String(storedToken) : null);

  const storedDevId = localStorage.getItem("devid");
  const [devId, setDevId] = useState <string | null>(storedDevId !== null ? String(storedDevId) : null);

  const storedUsername = localStorage.getItem("username");
  const [username, setUsername] = useState <string | null>(storedUsername !== null ? String(storedUsername) : null);

  const [forceRender, setForceRender] = useState(false);

  return (
    <ThemeProvider>
      <CssBaseline/>
      <Container>

      <Header token={token} setToken={setToken} devId={devId} setDevId={setDevId} username={username} setUsername={setUsername} />

      <Routes>
        <Route path="/" element={<Start />}/>
        <Route path="/login" element={<Login setToken={setToken} setDevId={setDevId} setUsername={setUsername} />}/>
        <Route path="/developer/:id" element={<DeveloperPage token={token} devId={devId} />}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/edit/:id" element={<DeveloperEdit token={token} devId={devId} profileDialogOpen={profileDialogOpen} setProfileDialogOpen={setProfileDialogOpen} projectDialogOpen={projectDialogOpen} setProjectDialogOpen={setProjectDialogOpen} setForceRender={setForceRender} forceRender={forceRender}/>}/>
        <Route path="/editprofile" element={<EditProfile token={token} devId={devId} profileDialogOpen={profileDialogOpen} setProfileDialogOpen={setProfileDialogOpen} setForceRender={setForceRender}/>}/>
        <Route path="/project" element={<AddProject token={token} devId={devId} projectDialogOpen={projectDialogOpen} setProjectDialogOpen={setProjectDialogOpen} setForceRender={setForceRender}/>}/>
      </Routes>

      </Container>
    </ThemeProvider>
  );
}

export default App;