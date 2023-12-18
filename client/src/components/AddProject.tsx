import React, { Dispatch, SetStateAction, useRef } from "react";
import { Button, Stack, TextField, Typography, Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useParams } from 'react-router-dom';
import { useState } from "react";
import { useApi } from '../apiUtils';

interface Props {
    token : string | null
    devId : string | null 
    projectDialogOpen : boolean
    setProjectDialogOpen : Dispatch<SetStateAction<boolean>>
    setForceRender : Dispatch<SetStateAction<boolean>>
}

const AddProject: React.FC<Props> = (props : Props) : React.ReactElement => {
    
    const { id } = useParams<{ id: string }>();

    const { setApiData } = useApi();
    
    const [error, setError] = useState<string>("");

    const formRef : any = useRef<HTMLFormElement>();

    const saveProject = async (e : React.FormEvent) : Promise<void> => {
      
      e.preventDefault();

      let projectData = {
        headline : "",
        description : "",
        techUsed1 : "",
        techUsed2 : "",
        techUsed3 : "",
        techUsed4 : "",
        techUsed5 : "",
        techUsed6 : "",
        repoUrl : ""
      };

      if (formRef.current?.headline.value && formRef.current?.description.value && formRef.current?.techUsed1.value) {
        projectData =  {
            headline : formRef.current?.headline.value,
            description : formRef.current?.description.value,
            techUsed1 : formRef.current?.techUsed1.value,
            techUsed2 : formRef.current?.techUsed2.value || null,
            techUsed3 : formRef.current?.techUsed3.value || null,
            techUsed4 : formRef.current?.techUsed4.value || null,
            techUsed5 : formRef.current?.techUsed5.value || null,
            techUsed6 : formRef.current?.techUsed6.value || null,
            repoUrl : formRef.current?.repoUrl.value || null
        }

        try {

            const connection = await fetch(`/api/edit`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${props.token}`,
                },
                body: JSON.stringify(projectData),
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

                props.setProjectDialogOpen(false);
                props.setForceRender((prev : boolean) => !prev);
              
              } else {
  
                setError("Adding project failed");
              }
            
          } catch (error) {
   
            setError("Connection to server failed");
          }
        
        } else {
            setError("Fill at least project name, description and the first technology field.")
        }
    
        }

    const cancel = () : void => {

        props.setProjectDialogOpen(false);
    
        };

    return <Dialog
            maxWidth="lg" 
            fullWidth={true}
            open={props.projectDialogOpen} 
            onClose={cancel}
            >
            <DialogTitle>Add new project</DialogTitle>
            <DialogContent style={{paddingTop : 10}}>
                <Stack 
                spacing={1}
                component="form"
                onSubmit={saveProject}
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
                >Add project</Button>

                <Button
                variant="outlined"
                onClick={cancel}
                >Back</Button>

                </Stack>
              </DialogContent>

            </Dialog>;
    
};

export default AddProject;