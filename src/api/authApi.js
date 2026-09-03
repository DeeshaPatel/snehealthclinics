import API from "./axios";


// ============================================================
// LOGIN
// ============================================================

export const loginUser = async (
    email,
    password
) => {

    const response =
        await API.post(
            "/auth/login",
            {
                email,
                password
            }
        );

    return response.data;
};


// ============================================================
// FORGOT PASSWORD
// ============================================================

export const forgotPassword = async (
    email
) => {

    const response =
        await API.post(
            "/auth/forgot-password",
            {
                email
            }
        );

    return response.data;
};


// ============================================================
// RESET PASSWORD
// ============================================================

export const resetPassword = async (
    token,
    password
) => {

    const response =
        await API.post(
            "/auth/reset-password",
            {
                token,
                password
            }
        );

    return response.data;
};