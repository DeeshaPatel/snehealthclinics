import API from "./axios";



export const createAppointment = async(data)=>{


const response = await API.post(

"/appointments",

data

);


return response.data;


};



export const getAppointments = async()=>{


const response = await API.get(

"/appointments"

);


return response.data;


};



export const updateAppointment = async(

id,

data

)=>{


const response = await API.put(

`/appointments/${id}`,

data

);


return response.data;


};



export const deleteAppointment = async(id)=>{


const response = await API.delete(

`/appointments/${id}`

);


return response.data;


};