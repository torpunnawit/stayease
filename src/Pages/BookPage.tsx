import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { message, Spin } from "antd";
import { booking } from "../services/booking";
import { useNavigate } from "react-router-dom";
import fetchUserRegisterData from "../services/userRegisterData";
import fetchBookedDates from "../services/bookedDates";
import { checkSession } from "../utils/authUtils";


interface BookedDatesResponse {
    room_id: number;
    checkin_date: string;
}

const rooms = [
    { id: 1, type: "Standard", booked: false },
    { id: 2, type: "Deluxe", booked: false },
    { id: 3, type: "Luxury", booked: false },
    { id: 4, type: "Standard", booked: false },
    { id: 5, type: "Deluxe", booked: false },
    { id: 6, type: "Luxury", booked: false },
];

const BookingForm = () => {
    const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [telNum, setTelNum] = useState("");
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    const [isBooked, setIsBooked] = useState(false);
    const [bookedDates, setBookedDates] = useState<BookedDatesResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDates = async () => {
            try {
                const data = await fetchBookedDates();
                setBookedDates(data);
            } catch (error) {
                console.error("Failed to fetch booked dates", error);
                message.error("Failed to fetch booked dates");
            }
        };
        const fetchUser = async () => {
            try {
                const data = await fetchUserRegisterData();
                console.log("user data:", data);
                setFirstName(data[0].firstname);
                setLastName(data[0].lastname);
                setEmail(data[0].email);
            } catch (error) {
                console.error("Failed to fetch user data", error);
                message.error("Failed to fetch user data");
            }
        };
        const fetchData = async () => {
            await fetchUser();
            await fetchDates();
            setLoading(false);
        };
        fetchData();
    }, [navigate]);

    useEffect(() => {
        if (checkInDate && checkOutDate && checkInDate.isAfter(checkOutDate)) {
            setCheckOutDate(null);
        }
    }, []);

    useEffect(() => { }, [checkInDate, checkOutDate]);

    useEffect(() => {
        const fetchData = async () => {
            if (!checkSession(navigate)) return;

            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                message.error("Failed to load data.");
                navigate("/");
            }
        };
        fetchData();
    }, [navigate]);

    const handleDateSelect = (selectedDate: Dayjs | null) => {
        if (!selectedDate) return;
        if (!checkInDate) {
            setCheckInDate(selectedDate);
            setCheckOutDate(null);
        } else if (checkInDate && checkOutDate) {
            setCheckInDate(null);
            setCheckOutDate(null);
        } else if (selectedDate.isAfter(checkInDate)) {
            setCheckOutDate(selectedDate);
        } else {
            setCheckInDate(selectedDate);
            setCheckOutDate(null);
        }
    };

    const handleRoomToggle = (roomId: number) => {
        setSelectedRoom(roomId);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let errors = [];

        if (!checkInDate || !checkOutDate) {
            message.error("Please select Check-in & Check-out date");
        }
        if (!selectedRoom) {
            message.error("Please select a room");
        }
        if (!checkInDate) errors.push("checkInDate");
        if (!checkOutDate) errors.push("checkOutDate");
        if (!firstName) errors.push("firstName");
        if (!lastName) errors.push("lastName");
        if (!email) errors.push("email");
        if (!telNum) errors.push("telNum");

        if (errors.length > 0) {
            setMissingFields(errors);
            message.error("Please fill in all required fields.");
            return;
        }

        if (selectedRoom === null) {
            message.error("Please select a room");
            return;
        }
        try {
            const data = await booking(
                firstName,
                lastName,
                email,
                telNum,
                checkInDate,
                checkOutDate,
                rooms[selectedRoom - 1].id
            );
            console.log("Your appointment was successful! 🎉", data);
            message.success("Your appointment was successful! 🎉");
            setIsBooked(true);
        } catch (error) {
            if (error instanceof Error) {
                console.log((error as any).response?.data?.message);
                message.error((error as any).response?.data?.message);
            } else {
                console.log("An unknown error occurred");
                message.error("An unknown error occurred");
            }
        }
        setMissingFields([]);
    };

    const isDateFullyBooked = (date: Dayjs) => {
        const formattedDate = date.format("DD-MM-YYYY");
        const roomsBookedOnDate = bookedDates.filter(
            (booking) => booking.checkin_date === formattedDate
        ).map((booking) => booking.room_id);

        return (roomsBookedOnDate.length == rooms.length);
    };

    const isRoomBookedOnSelectedDate = (roomId: number) => {
        if (!checkInDate) return false;
        const formattedDate = checkInDate.format("DD-MM-YYYY");
        return bookedDates.some(
            (booking) => booking.room_id === roomId && booking.checkin_date === formattedDate
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-6">
            <div className="bg-white shadow-xl rounded-xl p-6 max-w-4xl w-full">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        {isBooked ? (
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-green-600">
                                    🎉 Your appointment was successful! 🎉
                                </h2>
                                <p className="text-gray-700 mt-2">Thank you for booking with us.</p>
                                <div className="flex justify-center mt-4">
                                    <a href="/booking" className="mx-4">
                                        <button
                                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                                            onClick={() => setIsBooked(false)}
                                        >
                                            Book Again
                                        </button>
                                    </a>
                                    <a href="/" className="mx-4">
                                        <button
                                            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                                            onClick={() => setIsBooked(false)}
                                        >
                                            Log Out
                                        </button>
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 relative">
                                    <button
                                        onClick={() => navigate("/")}
                                        className="absolute top-4 left-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6 text-gray-600"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.75 19.5L8.25 12l7.5-7.5"
                                            />
                                        </svg>
                                    </button>
                                    <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                                        Choose Check-in & Check-out date
                                    </h2>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateCalendar
                                            value={checkInDate || checkOutDate}
                                            onChange={handleDateSelect}
                                            shouldDisableDate={(day) =>
                                                isDateFullyBooked(day) ||
                                                (checkInDate || new Date()
                                                    ? day.isBefore(checkInDate, "day") ||
                                                    day.isAfter(checkOutDate, "day") ||
                                                    day.isBefore(new Date(), "day")
                                                    : false)
                                            }
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                        Booking Details
                                    </h2>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Select a Room
                                        </label>
                                        <div className={`grid grid-cols-3 gap-3 `}>
                                            {rooms.map((room) => (
                                                <button
                                                    key={room.id}
                                                    className={`p-3 rounded-lg text-sm font-medium transition duration-200 ease-in-out text-center border ${missingFields.includes("selectedRoom")
                                                        ? "border-red-500 "
                                                        : "border-blue-300"
                                                        } ${room.booked || isRoomBookedOnSelectedDate(room.id)
                                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                            : selectedRoom === room.id
                                                                ? "bg-blue-600 text-white border-none"
                                                                : "bg-gray-100 hover:bg-gray-200"
                                                        }`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (!room.booked && !isRoomBookedOnSelectedDate(room.id)) handleRoomToggle(room.id);
                                                    }}
                                                    disabled={room.booked || isRoomBookedOnSelectedDate(room.id)}
                                                >
                                                    Room {room.id} <br /> ({room.type})
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="my-4">
                                        <input
                                            type="text"
                                            placeholder="Check-in Date"
                                            className={`w-full p-3 border border-blue-300 rounded-lg bg-gray-100 ${missingFields.includes("checkInDate")
                                                ? "border-red-500 bg-red-100"
                                                : "border-blue-300"
                                                }`}
                                            value={checkInDate ? checkInDate.format("DD MMMM YYYY") : ""}
                                            readOnly
                                        />
                                        <input
                                            type="text"
                                            placeholder="Check-out Date"
                                            className={`w-full p-3 border border-blue-300 rounded-lg bg-gray-100 mt-2 ${missingFields.includes("checkOutDate")
                                                ? "border-red-500 bg-red-100"
                                                : "border-blue-300"
                                                }`}
                                            value={
                                                checkOutDate ? checkOutDate.format("DD MMMM YYYY") : ""
                                            }
                                            readOnly
                                        />
                                    </div>
                                    <form className="space-y-4 mt-4">
                                        <input
                                            type="text"
                                            placeholder="First Name*"
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${missingFields.includes("firstName")
                                                ? "border-red-500 bg-red-100"
                                                : "border-blue-300"
                                                }`}
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            readOnly
                                        />
                                        <input
                                            type="text"
                                            placeholder="Last Name*"
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${missingFields.includes("lastName")
                                                ? "border-red-500 bg-red-100"
                                                : "border-blue-300"
                                                }`}
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            readOnly
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email Address*"
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${missingFields.includes("email")
                                                ? "border-red-500 bg-red-100"
                                                : "border-blue-300"
                                                }`}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            readOnly
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone Number*"
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${missingFields.includes("telNum")
                                                ? "border-red-500 bg-red-100"
                                                : "border-blue-300"
                                                }`}
                                            value={telNum}
                                            onChange={(e) => setTelNum(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md"
                                            onClick={handleSubmit}
                                        >
                                            Schedule Appointment
                                        </button>
                                        <button
                                            type="button"
                                            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg shadow-md mt-4"
                                            onClick={() => navigate("/history")}
                                        >
                                            View Booking History
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingForm;