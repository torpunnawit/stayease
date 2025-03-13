import dayjs from "dayjs";
import api from "../api/axios";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface BookedDatesResponse {
  room_id: number;
  checkin_date: string;
}

interface BookedDates {
  room_id: number;
  checkin_date: string;
}

export default async function fetchBookedDates(): Promise<BookedDates[]> {
  try {
    const response = await api.get<{ data: BookedDatesResponse[] }>(
      "/api/bookedDate"
    );
    console.log("bookedDate API response:", response.data);

    const formattedDateData: BookedDates[] = response.data.data.map(
      (booking: BookedDatesResponse) => ({
        ...booking,
        checkin_date: dayjs(booking.checkin_date)
          .tz("Asia/Bangkok")
          .format("DD-MM-YYYY"),
      })
    );

    return formattedDateData;
  } catch (error) {
    console.error("Failed to fetch booked dates", error);
    throw error;
  }
}
