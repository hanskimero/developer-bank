import React, {useState, useEffect } from 'react';
import { Typography, Alert, Button, Paper, ListItem, Backdrop, CircularProgress, Chip, Link as MuiLink, IconButton, Grid } from '@mui/material';
import { GitHub as GitHubIcon } from '@mui/icons-material';
import {useNavigate, NavigateFunction, useParams, Link} from 'react-router-dom';
import { Project } from '../types';
import { format, parseJSON } from 'date-fns';
import { useApi } from '../apiUtils';


interface Props {
  token : string | null 
  devId : string | null
}


const DeveloperPage : React.FC<Props> = (props : Props) : React.ReactElement => {

  const { id } = useParams<{ id: string }>();
  const { apiData,  apiCall } = useApi();
  const [canEdit, setCanEdit] = useState(false);

  const navigate : NavigateFunction = useNavigate();

  const fetchDeveloper =  async () => {

    try {
     
      if (typeof id === 'string' && id.length > 0) {
        const url = `/api/developers/${id}`;
        await apiCall(url, 'GET');
      }
    } catch (error) {
      
      console.error('Error in API call:', error);
    }
  };

  useEffect(() => {

    if (typeof id === 'string' && id.length > 0) {
      fetchDeveloper();
    }
  }, [id]);

  const handleEditClick = () => {
    
    navigate(`/edit/${id}`);
  };

  useEffect(() => {
    if (props.token) {
      setCanEdit(true);
    } else {
      setCanEdit(false);
    }
    
  }, []);
 
  return (
    <>

    <Button 
      component={Link}
      to={"/"}
      sx={{marginTop: 5, marginBottom: 2}}
      variant='outlined'
      >
      Back to front page
    </Button>

    {(Boolean(apiData.error))
      ? <Alert severity="error">{apiData.error}</Alert>
      : (apiData.fetched)
        ? <>
          <Typography variant="h6">
            {`${apiData.content.firstname} ${apiData.content.lastname}`}{' '}
            {apiData.content.githubUrl && (
              <MuiLink href={apiData.content.githubUrl} target="_blank" rel="noopener noreferrer">
              <IconButton>
                <GitHubIcon />
              </IconButton>
            </MuiLink>
            )}
          </Typography>

          <Typography variant="body1" sx={{marginBottom : 2, marginTop : 2}}>
          {apiData.content.description} 
          </Typography>

          {canEdit && String(props.devId) === id && (
          <Button 
            onClick={handleEditClick}
            variant="outlined"
            >
            Edit your profile and projects
          </Button>
          )}
          
          {apiData.content.projects
          ? (apiData.content.projects
            .sort((a, b) => parseJSON(b.timestamp).getTime() - parseJSON(a.timestamp).getTime())
            .map((project : Project) => (
              <Paper key={project.id} sx={{ marginY: 2, padding: 2 }}>
            <ListItem>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">{project.headline}</Typography>
                  <Typography variant="caption">
                    {format(parseJSON(project.timestamp), "dd.MM.yyyy")}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: 2 }}>
                    {project.description}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <div>
                    {project.techUsed1 && (
                      <Chip label={project.techUsed1} sx={{ marginRight: 1, marginBottom: 1 }} />
                    )}

                    {project.techUsed2 && (
                      <Chip label={project.techUsed2} sx={{ marginRight: 1, marginBottom: 1 }} />
                    )}

                    {project.techUsed3 && (
                      <Chip label={project.techUsed3} sx={{ marginRight: 1, marginBottom: 1 }} />
                    )}

                    {project.techUsed4 && (
                      <Chip label={project.techUsed4} sx={{ marginRight: 1, marginBottom: 1 }} />
                    )}

                    {project.techUsed5 && (
                      <Chip label={project.techUsed5} sx={{ marginRight: 1, marginBottom: 1 }} />
                    )}

                    {project.techUsed6 && (
                      <Chip label={project.techUsed6} sx={{ marginRight: 1, marginBottom: 1 }} />
                    )}
                  </div>
                </Grid>
                <Grid item xs={12}>
                  {project.repoUrl && (
                    <Button
                      variant="text"
                      color="primary"
                      component="a"
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Repository
                    </Button>
                  )}
                </Grid>
              </Grid>
            </ListItem>
          </Paper>
            ))

          ) : (
            <Typography variant="body1">No projects available</Typography>
          )}
          </>
        : <Backdrop open={true}>
          <CircularProgress color='inherit'/>
        </Backdrop>
    }
       
    </>    
    
  );
}

export default DeveloperPage;