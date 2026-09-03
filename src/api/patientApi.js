import API from "./axios";


export const getPatients = async () => {

    const response = await API.get("/patients");

    return response.data;

};


export const getPatient = async (id) => {

    const response = await API.get(`/patients/${id}`);

    return response.data;

};


export const createPatient = async (patient) => {

    const response = await API.post(
        "/patients",
        patient
    );

    return response.data;

};


export const updatePatient = async (
    id,
    patient
) => {

    const response = await API.put(
        `/patients/${id}`,
        patient
    );

    return response.data;

};


export const deletePatient = async (id) => {

    const response = await API.delete(
        `/patients/${id}`
    );

    return response.data;

};

export const getPatientHistory = async (id) => {

    const response =
        await API.get(
            `/patients/${id}/history`
        );

    return response.data;

};