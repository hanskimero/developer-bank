import React, { Dispatch, SetStateAction, useRef } from "react";
import { Button, Stack, TextField, Typography, Dialog, DialogContent, DialogTitle} from "@mui/material";
import { useParams } from 'react-router-dom';
import { useState } from "react";

interface Props {
    token : string | null 
    devId : string | null
    profileDialogOpen : boolean
    setProfileDialogOpen : Dispatch<SetStateAction<boolean>>
    setForceRender : Dispatch<SetStateAction<boolean>>
}

const EditProfile: React.FC<Props> = (props : Props) : React.ReactElement => {

    const { id } = useParams<{ id: string }>();
  
    const [error, setError] = useState<string>("");

    const formRef : any = useRef<HTMLFormElement>();


    const edit = async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
    
      const updatedData: { [key: string]: string } = {};
    
      if (formRef.current?.githubUrl.value) {
        updatedData.githubUrl = formRef.current?.githubUrl.value;
      }
    
      if (formRef.current?.description.value) {
        updatedData.description = formRef.current?.description.value;
      }

      if (Object.keys(updatedData).length === 0) {
        setError('No fields to update.');
        console.log('No fields to update');
        return;
      }
    
      try {
  
        const response = await fetch(`/api/edit/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${props.token}`,
          },
          body: JSON.stringify(updatedData),
        });
    
        if (response.ok) {
          
          props.setProfileDialogOpen(false);
          props.setForceRender((prev: boolean) => !prev);

        } else {
    
          setError('Profile update failed');
          console.error('Profile update failed');
        }
      } catch (error) {
  
        console.error('Error updating profile:', error);
        setError('Profile update failed - no connection to the server');
      }
    };
    
    const cancel = () : void => {

        props.setProfileDialogOpen(false);
    
      } 

    return <Dialog
            maxWidth="lg" 
            fullWidth={true}
            open={props.profileDialogOpen} 
            onClose={cancel}
          >
          <DialogTitle>Edit your profile</DialogTitle>
          <DialogContent style={{paddingTop : 10}}>
            <Stack 
              spacing={1} 
              component="form"
              onSubmit={edit}
              ref={formRef}
            >
            <TextField
              name="description"
              label="Describe yourself as a developer"
              fullWidth
              variant="outlined"
              maxRows={5}
              required={false}
            />
            <TextField
              name="githubUrl"
              label="Link to your GitHub profile"
              fullWidth
              variant="outlined"
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
              onClick={cancel}
            >Back</Button>

            </Stack>
          </DialogContent>

        </Dialog>;
    
};

export default EditProfile;