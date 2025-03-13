import { Dayjs } from "dayjs";
import api from "../api/axios";

export const booking = async (
  firstname: string,
  lastname: string,
  email: string,
  phone: string,
  checkin: Dayjs | null,
  checkout: Dayjs | null,
  room_id: number
) => {
  try {
    const response = await api.post("/api/booking", {
      firstname,
      lastname,
      email,
      phone,
      checkin,
      checkout,
      room_id,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
