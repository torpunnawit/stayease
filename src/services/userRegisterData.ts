import api from "../api/axios";

interface userRegisterData {
  firstname: string;
  lastname: string;
  email: string;
}

interface userRegisterDataResponse {
  firstname: string;
  lastname: string;
  email: string;
}

export default async function fetchUserRegisterData(): Promise<
  userRegisterDataResponse[]
> {
  const userId = localStorage.getItem("userId");

  try {
    const response = await api.get<{ data: userRegisterData[] }>(
      `/api/userData/${userId}`,
      { withCredentials: true }
    );
    console.log("userData API response:", response.data);

    return response.data.data;
  } catch (error) {
    console.log("user_id:", userId);
    console.error("Failed to fetch booked dates", error);
    throw error;
  }
}
