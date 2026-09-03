import API from "./axios";


// =====================================================
// GET SETTINGS
// =====================================================

export const getAppointmentSettings = async () => {

    const response = await API.get(
        "/settings/appointments"
    );

    return response.data;

};

export const getAppointmentTypes = async () => {
    const response = await API.get("/appointment-types");
    return response.data;
};


// =====================================================
// SAVE SETTINGS
// =====================================================

export const saveAppointmentSettings = async (
    data
) => {

    const response = await API.put(
        "/settings/appointments",
        data
    );

    return response.data;

};

export const getBusinessHours = async () => {

    const response =
        await API.get(
            "/settings/appointments/business-hours"
        );

    return response.data;

};

export const getClinicHolidays = async () => { 
    const response = 
        await API.get(
            "/settings/appointments/clinic-holidays"
        ); 
    return response.data; 
};