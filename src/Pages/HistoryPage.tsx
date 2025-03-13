import { useEffect, useState } from "react";
import { message } from "antd";
import fetchBookingHistory from "../services/userBookingData";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // Import the loading spinner

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

const BookingHistory = () => {
    const [bookingHistory, setBookingHistory] = useState<userBookingData[]>([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem("token");
            console.log("token:", token);

            if (!token) {
                message.error("No token found. Please login again.");
                localStorage.removeItem("token");
                navigate("/");
                return;
            }
            try {
                const data = await fetchBookingHistory();
                console.log("Booking history data:", data);
                setBookingHistory(data);
            } catch (error) {
                console.error("Failed to fetch booking history", error);
                message.error("Failed to fetch booking history");
            } finally {
                setLoading(false); // Set loading to false when fetch completes
            }
        };

        fetchHistory();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-6">
            <div className="bg-white shadow-xl rounded-xl p-6 max-w-4xl w-full">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <ClipLoader size={50} color="#4A90E2" /> {/* Show spinner when loading */}
                    </div>
                ) : (
                    <>
                        {bookingHistory.length > 0 ? (
                            <>
                                <h2 className="text-2xl font-bold text-gray-700 mb-2">{bookingHistory[0].firstname}'s Booking History</h2>
                                <p className="mb-2"><strong>User:</strong> {bookingHistory[0].email}</p>
                                <ul className="space-y-4">
                                    {bookingHistory.map((history, index) => (
                                        <li key={index} className="p-4 border rounded-lg bg-gray-100">
                                            <p><strong>Room ID:</strong> {history.room_id}</p>
                                            <p><strong>Check-in Date:</strong> {history.checkin_date}</p>
                                            <p><strong>Check-out Date:</strong> {history.checkout_date}</p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p className="text-gray-600">No booking history available.</p>
                        )}
                        <button
                            onClick={() => navigate("/booking")}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            Back to Booking
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingHistory;