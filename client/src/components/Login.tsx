import React, { Dispatch, SetStateAction, useRef } from "react";
import { Backdrop, Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { useState } from "react";
import { ThemeProvider } from '../themeContext';

interface Props {
    setToken : Dispatch<SetStateAction<string | null>> 
    setDevId : Dispatch<SetStateAction<string | null>>
    setUsername : Dispatch<SetStateAction<string | null>>
}

const Login: React.FC<Props> = (props : Props) : React.ReactElement => {

    const [error, setError] = useState<string>("");

    const navigate : NavigateFunction = useNavigate();

    const formRef = useRef<HTMLFormElement>();

    const login = async (e : React.FormEvent) : Promise<void> => {
        e.preventDefault();
      
        if (formRef.current?.username.value) {
          const username = formRef.current?.username.value;
      
          if (formRef.current?.password.value) {
            try {
              const connection = await fetch("/api/auth/login", {
                method : "POST",
                headers : {
                  'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                  username: username,
                  password: formRef.current?.password.value
                })
              });
      
              if (connection.ok) {
                const data = await connection.json();
                const { username, token, devId } = data;

                props.setUsername(username);
                localStorage.setItem("username", username);

                props.setToken(token);
                localStorage.setItem("token", token);
      
                props.setDevId(devId);
                localStorage.setItem("devId", devId);
      
                navigate(`/developer/${devId}`);
              } else {
 
                setError("Login failed. Check username and password.");
              }
            } catch (error) {
              console.error('Login error:', error);
              setError("An error occurred during login");
            }
          }
        }
      };

    return (
        <ThemeProvider>
        <>
            <Backdrop open={true}>
                <Paper sx={{padding : 2}}>
                    <Box
                        component="form"
                        onSubmit={login}
                        ref={formRef}
                        style={{
                            width: 300,
                            backgroundColor : "#fff",
                            padding : 20
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="h6">Login</Typography>
                            <TextField 
                                label="username" 
                                name="username"
                            />
                            <TextField 
                                label="password"
                                name="password"
                                type="password" 
                            />
                            {error && (
                                <Typography variant="body2" color="error">
                                    {error}
                                </Typography>
                            )}
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                            >
                                Login
                            </Button>
                            <Button 
                                type="submit" 
                                variant="outlined" 
                                size="large"
                                onClick={() => navigate('/')}
                            >
                                Back
                            </Button>
                            <Typography>
                                (Use testing user account: user : testUser, password : linnaDev)
                            </Typography>
                        </Stack>
                        
                    </Box>
                </Paper>
            </Backdrop>
        </>
        </ThemeProvider>
    );
};

export default Login;