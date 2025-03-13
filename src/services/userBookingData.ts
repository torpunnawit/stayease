import api from "../api/axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
interface userBookingData {
  email: string;
  firstname: string;
  lastname: string;
  booking_id: number;
  room_id: number;
  phone: string;
  checkin_date: string;
  checkout_date: string;
}

interface userBookingDataResponse {
  email: string;
  firstname: string;
  lastname: string;
  booking_id: number;
  room_id: number;
  phone: string;
  checkin_date: string;
  checkout_date: string;
}

export default async function fetchUserBookingData(): Promise<
  userBookingDataResponse[]
> {
  const userId = localStorage.getItem("userId");
  console.log("userId:", userId);

  try {
    const response = await api.get<{ data: userBookingData[] }>(
      `/api/userBookingData/${userId}`
    );
    console.log("userData API response:", response.data);

    const formattedDateData: userBookingData[] = response.data.data.map(
      (booking: userBookingDataResponse) => ({
        ...booking,
        checkin_date: dayjs(booking.checkin_date)
          .tz("Asia/Bangkok")
          .format("DD-MM-YYYY"),
        checkout_date: dayjs(booking.checkout_date)
          .tz("Asia/Bangkok")
          .format("DD-MM-YYYY"),
      })
    );
    return formattedDateData;
  } catch (error) {
    console.log("user_id:", userId);
    console.error("Failed to fetch booked dates", error);
    throw error;
  }
}
