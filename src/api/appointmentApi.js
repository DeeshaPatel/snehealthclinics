import API from "./axios";

/*
=========================================================
PROVIDERS
=========================================================
*/

export const getProviders = async () => {

    const response = await API.get("/providers");

    return response.data;

};


/*
=========================================================
CREATE APPOINTMENT
=========================================================
*/

export const createAppointment = async (data) => {

    const response = await API.post(
        "/appointments",
        data
    );

    return response.data;

};


/*
=========================================================
GET APPOINTMENTS
=========================================================
*/

export const getAppointments = async () => {

    const response = await API.get(
        "/appointments"
    );

    return response.data;

};


/*
=========================================================
UPDATE APPOINTMENT
=========================================================
*/

export const updateAppointment = async (
    id,
    data
) => {

    const response = await API.put(
        `/appointments/${id}`,
        data
    );

    return response.data;

};


/*
=========================================================
DELETE APPOINTMENT
=========================================================
*/

export const deleteAppointment = async (id) => {

    const response = await API.delete(
        `/appointments/${id}`
    );

    return response.data;

};