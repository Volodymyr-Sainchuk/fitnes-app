import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth/useAuth.jsx";
import { createBooking } from "../../../services/bookingApi.js";
import Button from "../../common/Button/Button.jsx";

export default function BookingButton({ classId, onBooked }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBook = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await createBooking(classId);
      if (onBooked) onBooked();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleBook} disabled={loading}>
        {loading ? "Обробка..." : "Забронювати"}
      </Button>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
