import api from "../api/axios";

export const register = async (
  email: string,
  password: string,
  firstname: string,
  lastname: string
) => {
  try {
    const response = await api.post("/api/register", {
      email,
      password,
      firstname,
      lastname,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
