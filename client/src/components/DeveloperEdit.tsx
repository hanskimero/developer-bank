import React, {useState, useRef,useEffect, Dispatch, SetStateAction} from 'react';
import { Typography, Alert, Button, TextField, Paper, ListItem, Stack, Backdrop, CircularProgress, Chip, Link as MuiLink, IconButton, Grid, Dialog, DialogContent, DialogActions, DialogContentText, DialogTitle } from '@mui/material';
import { GitHub as GitHubIcon, Edit as EditIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useParams, Link} from 'react-router-dom';
import { Project } from '../types';
import { format, parseJSON } from 'date-fns';
import EditProfile from './EditProfile';
import AddProject from './AddProject';
import { useApi } from '../apiUtils';


interface Props {
  token : string | null 
  devId : string | null
  profileDialogOpen : boolean
  setProfileDialogOpen : Dispatch<SetStateAction<boolean>>
  projectDialogOpen : boolean
  setProjectDialogOpen : Dispatch<SetStateAction<boolean>>
  setForceRender : Dispatch<SetStateAction<boolean>>
  forceRender : boolean
}

const DeveloperEdit : React.FC<Props> = (props : Props) : React.ReactElement => {

  const { id } = useParams<{ id: string }>();

  const { apiData, setApiData, fetchData } = useApi();

  const [error, setError] = useState<string>("");

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState<string>("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [projectIdToEdit, setProjectIdToEdit] = useState<string>("");

  const formRef : any = useRef<HTMLFormElement>();

  const handleDelete = async (projectId : string) : Promise<void> => {

    try {

      const connection = await fetch(`/api/edit/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.token}`,
        },
      })

      if (connection.ok) {

        const updatedProjectsData = await connection.json();

        setApiData((prevApiData) => ({
          ...prevApiData,
          content: {
            ...prevApiData.content,
            projects: updatedProjectsData,
          },
        }));

        setDeleteConfirmationOpen(false);
        
      } else {
        console.error(`Failed to delete project.`);
        setError("Deleting project failed")
      }
    } catch {
      console.error('Error updating profile:', error);
        setError('Deleting project failed - no connection to the server');
    }

  };

  const editProject = async (e: React.FormEvent, projectId : string): Promise<void> => {
    
    e.preventDefault();
  
    const updatedProject: { [key: string]: string } = {};
  
    if (formRef.current?.headline.value) {
      updatedProject.headline = formRef.current?.headline.value;
    }
  
    if (formRef.current?.description.value) {
      updatedProject.description = formRef.current?.description.value;
    }

    if (formRef.current?.techUsed1.value) {
      updatedProject.techUsed1 = formRef.current?.techUsed1.value;
    }

    if (formRef.current?.techUsed2.value) {
      updatedProject.techUsed2 = formRef.current?.techUsed2.value;
    }

    if (formRef.current?.techUsed3.value) {
      updatedProject.techUsed3 = formRef.current?.techUsed3.value;
    }

    if (formRef.current?.techUsed4.value) {
      updatedProject.techUsed4 = formRef.current?.techUsed4.value;
    }

    if (formRef.current?.techUsed5.value) {
      updatedProject.techUsed5 = formRef.current?.techUsed5.value;
    }

    if (formRef.current?.techUsed6.value) {
      updatedProject.techUsed6 = formRef.current?.techUsed6.value;
    }

    if (formRef.current?.repoUrl.value) {
      updatedProject.repoUrl = formRef.current?.repoUrl.value;
    }
  
    // Check if there are any fields to update
    if (Object.keys(updatedProject).length === 0) {
      setError('No fields to update.');
      return;
    }
  
    try {
      const connection = await fetch(`/api/edit/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.token}`,
        },
        body: JSON.stringify(updatedProject),
      });
  
      if (connection.ok) {

        const updatedProjectsData = await connection.json();

        setApiData((prevApiData) => ({
          ...prevApiData,
          content: {
            ...prevApiData.content,
            projects: updatedProjectsData,
          },
        }));

        setEditDialogOpen(false);

      } else {
    
        setError('Project update failed');
       
      }
    } catch (error) {
      
      setError('Project update failed - no connection to the server');
    }
  };

  useEffect(() => {
  
    if (typeof id === 'string' && id.length > 0) {
      const url = `/api/developers/${id}`;
      fetchData(url);
    }
   
  }, [id]);

  useEffect(() => {
    if (props.forceRender) {
      const url = `/api/developers/${id}`;
      fetchData(url);
      props.setForceRender(false);
    }
  }, [props.forceRender, id]);
  

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

          <Typography variant="body1" sx={{ marginBottom: 2, marginTop: 2 }}>
            {apiData.content.description}
            <IconButton
              onClick={() => { props.setProfileDialogOpen(true) }} >
              <EditIcon />
            </IconButton>
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => { props.setProjectDialogOpen(true) }}
          >
            Add Project
          </Button>

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
                
                {/* Edit and Delete buttons */}
                <Grid item xs={12} sx={{ position: 'absolute', top: 0, right: 0 }}>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setProjectIdToEdit(String(project.id));
                      setEditDialogOpen(true);
                      console.log(`Edit project ${project.id}`);
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setProjectIdToDelete(String(project.id))
                      setDeleteConfirmationOpen(true);
                      console.log(`Delete project ${project.id}`);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
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


    {/* Dialog for deleting project */}
    <Dialog
      open={deleteConfirmationOpen}
      onClose={() => setDeleteConfirmationOpen(false)}
    >
      <DialogTitle>Delete Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this project?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleDelete(projectIdToDelete)}
          color="secondary"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>

    {/* Dialog for editing project */}
    <Dialog
            maxWidth="lg" 
            fullWidth={true}
            open={editDialogOpen} 
            onClose={() => setEditDialogOpen(false)}
        >
        <DialogTitle>Edit your project</DialogTitle>
        <DialogContent style={{paddingTop : 10}}>
            <Stack 
            spacing={1}
            component="form"
            onSubmit={(e) => editProject(e, projectIdToEdit)}
            ref={formRef}
            >
            <TextField 
                label="Project name" 
                name="headline"
            />
            <TextField 
                label="Describe your project here"
                name="description"
                multiline
                maxRows={5}
            />
           {/* TechUsed Fields */}
           <Typography variant="subtitle1" gutterBottom>
            Tech Used
          </Typography>
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Grid item key={index}>
                <TextField label={`Add used technology here`} name={`techUsed${index}`} />
              </Grid>
            ))}
          </Grid>

            <TextField 
                label="Link to project repository" 
                name="repoUrl"
            />

            {error && (
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
            )}

            <Button 
            variant="contained"
            type="submit"
            >Save changes</Button>

            <Button
            variant="outlined"
            onClick={() => setEditDialogOpen(false)}
            >Cancel</Button>

            </Stack>
        </DialogContent>

        </Dialog>


   <EditProfile token={props.token} devId={props.devId} profileDialogOpen={props.profileDialogOpen} setProfileDialogOpen={props.setProfileDialogOpen} setForceRender={props.setForceRender}/>
   <AddProject token={props.token} devId={props.devId} projectDialogOpen={props.projectDialogOpen} setProjectDialogOpen={props.setProjectDialogOpen} setForceRender={props.setForceRender}/>
</>
    
  );
}

export default DeveloperEdit;