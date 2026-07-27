import API from "./axios";



export const getProviders = async()=>{


const response = await API.get(

"/providers"

);


return response.data;


};