import { useEffect, useState } from "react";
import Loader from "../../common/Loader/Loader.jsx";
import { cancelBooking, fetchMyBookings } from "../../../services/bookingApi.js";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchMyBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      await loadBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loader label="Завантажуємо бронювання..." />;
  if (error) return <p className="form-error">{error}</p>;
  if (!bookings.length) return <p className="empty-state">У вас поки немає бронювань.</p>;

  return (
    <div className="booking-list">
      {bookings.map((booking) => (
        <article key={booking.id} className="info-card booking-card">
          <div>
            <h3>{booking.fitness?.title || "Заняття"}</h3>
            <p>{new Date(booking.fitness?.dateTime).toLocaleString("uk-UA")}</p>
          </div>
          <button className="button secondary" onClick={() => handleCancel(booking.id)}>
            Скасувати
          </button>
        </article>
      ))}
    </div>
  );
}
