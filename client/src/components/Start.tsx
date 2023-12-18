import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Typography, Alert, Paper, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import { Developer } from '../types'
import { useApi } from '../apiUtils';


const Start : React.FC = () : React.ReactElement => {
  
  const { apiData, apiCall } = useApi();

  const fetchDevelopers = async () => {

    if(!apiData.fetched) {

      try {
        const url = `/api/developers`
        await apiCall(url, 'GET');
    
      } catch (error) {
      
        console.error('Error in API call:', error);
      }

    }
    
  };
  
  useEffect(() => {
  
    fetchDevelopers()

  }, [apiData.fetched]);
  

return (
  <>
    <Typography variant="h6" sx={{ marginBottom: 2, marginTop: 2 }}>
      Developers
    </Typography>

    {Boolean(apiData.error) ? (
      <Alert severity="error">{apiData.error}</Alert>
    ) : (
      <List>
        {apiData.content.developers?.map((developer: Developer) => (
          <Link key={developer.id} to={`/developer/${developer.id}`} style={{ textDecoration: 'none' }}>
            <Paper key={developer.id} sx={{ marginTop: 1, padding: 2 }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{developer.lastname[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${developer.firstname} ${developer.lastname}`}
                  secondary={
                    <Typography variant="body2">{developer.description}</Typography>
                  }
                />
              </ListItem>
            </Paper>
          </Link>
        ))}
      </List>
    )}
  </>
);

}

export default Start;