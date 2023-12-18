
import { useState } from 'react';
import { ApiData, fetchSettings } from './types';

export const useApi = () => {

  const [apiData, setApiData] = useState<ApiData>({
    content: {
      developers: [],
    },
    error: '',
    fetched: false,
  });

  const apiCall = async (url: string, method?: string,  data?: any, id?: string): Promise<void> => {

    setApiData((prevApiData) => ({
      ...prevApiData,
      fetched: false,
    }));

    // problems with id type, so not using this
    //let url = id ? `http://localhost:3109/api/developers/${id}` : 'http://localhost:3109/api/developers';

    let settings: fetchSettings = {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization' : `Bearer ${token}` // apiCall is used only fetches that need no authentication
      },
    };

    // wont need this, once POST and PUT requests are handled in dedicatedfunctions
    // if (method === 'POST' || method ==='PUT') {
    //   settings = {
    //     ...settings,
    //     body: JSON.stringify({
    //       ...data,
    //     }),
    //   };
    // }


    try {
      const connection = await fetch(url, settings);

      console.log('API Connection:', connection);

      if (connection.status === 200) {
        const responseData = await connection.json();

        setApiData((prevApiData) => ({
          ...prevApiData,
          content: Array.isArray(responseData) ? { developers: responseData } : responseData,
          fetched: true,
        }));

        return responseData;

      } else if (connection.status === 404) {

        setApiData((prevApiData) => ({
          ...prevApiData,
          error: 'Data not found',
          fetched: true,
        }));

      } else {

        setApiData((prevApiData) => ({
          ...prevApiData,
          error: 'Unexpected error on the server',
          fetched: true,
        }));

      }
    } catch (e: any) {

      setApiData((prevApiData) => ({
        ...prevApiData,
        error: 'Unable to connect to the server',
        fetched: true,
      }));
    }
  };

  //used in DeveloperEdit-page with rendering problems
  const fetchData =  async (url : string) => {

    try {
      
      if (typeof url === 'string' && url.length > 0) {
  
        await apiCall(url, 'GET');
        
      }

    } catch (error) {
      
      console.error('Error in fetchData:', error);
    }
  };

  return { apiData, setApiData, apiCall, fetchData };

};
