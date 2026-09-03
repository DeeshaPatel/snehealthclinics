import API from "./axios";



export const getProviders = async()=>{


    const response = await API.get(

    "/providers"

    );


    return response.data;


};

export const createProvider = async (providerData) => {

    const response = await API.post(
        "/providers",
        providerData
    );

    return response.data;

};

// DELETE PROVIDER

export const deleteProvider = async (providerId) => {

    const response = await API.delete(
        `/providers/${providerId}`
    );

    return response.data;

};