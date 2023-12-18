import React, { useState, useEffect, useRef } from "react";
import { Backdrop, Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { ThemeProvider } from '../themeContext';

interface regData {
    status : boolean,
    error : string
}

const Register: React.FC = () : React.ReactElement => {

    const [registrationData, setRegistrationData] = useState<regData>({
        status: false,
        error: ""
    });

    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>();

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
    
        if (formRef.current?.username.value && formRef.current?.password.value && formRef.current?.firstname.value && formRef.current?.firstname.value) {
            try {
                const connection = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: formRef.current?.username.value,
                        password: formRef.current?.password.value,
                        firstname: formRef.current?.firstname.value,
                        lastname: formRef.current?.lastname.value,
                        description: formRef.current?.description.value || null,
                        githubUrl: formRef.current?.githubUrl.value || null
                    })
                });
    
                if (connection.ok) {
                    setRegistrationData({
                        status: true,
                        error: ""
                    });

                    formRef.current?.reset();
                   
                } else {
                    setRegistrationData({
                        status: false,
                        error: "Creating user failed."
                    });
                }
            } catch (error) {
                console.error("Error creating user:", error);
                setRegistrationData({
                    status: false,
                    error: "Username already taken."
                });
            }
        } else {
            setRegistrationData({
                status: false,
                error: "Fill at least username, password, firstname and lastname."
            })
        }
    };


    useEffect(() => {
        
    }, [registrationData]);

    return (
        <ThemeProvider>
        <>
            <Backdrop open={true} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Paper sx={{ padding: 2, zIndex: (theme) => theme.zIndex.drawer + 2 }}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        ref={formRef}
                        style={{
                            width: 300,
                            backgroundColor : "#fff",
                            padding : 20
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="h6">Create new user</Typography>
                            <TextField 
                                label="username" 
                                name="username"
                                required
                            />
                            <TextField 
                                label="password"
                                name="password"
                                type="password" 
                                required
                            />
                            <TextField 
                                label="firstname" 
                                name="firstname"
                                required
                            />
                            <TextField 
                                label="lastname"
                                name="lastname"
                                required
                            />
                            <TextField 
                                label="description" 
                                name="description"
                                multiline
                                maxRows={5}
                                required
                            />
                            <TextField 
                                label="githubUrl"
                                name="githubUrl"
                                type="url" 
                                required
                            />
                        
                            {registrationData.status ? (
                                <Typography variant="body2" color="green">
                                New user created. Please login from start-page.
                                </Typography>
                            ) : (
                                <Typography variant="body2" color="red">
                                {registrationData.error}
                                </Typography>
                            )}
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                            >
                                Create new user
                            </Button>
                            <Button 
                                type="submit" 
                                variant="outlined" 
                                size="large"
                                onClick={() => navigate('/')}
                            >
                                Return
                            </Button>
                        </Stack>
                        
                    </Box>
                </Paper>
            </Backdrop>
        </>
        </ThemeProvider>
    );
};

export default Register;