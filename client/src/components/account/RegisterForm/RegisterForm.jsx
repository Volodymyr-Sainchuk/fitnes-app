import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth/useAuth.jsx";
import { registerUser } from "../../../services/authApi.js";
import Button from "../../common/Button/Button.jsx";
import Input from "../../common/Input/Input.jsx";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const authUser = await registerUser(form);
      login(authUser.user, authUser.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <Input label="Ім'я" id="name" name="name" value={form.name} onChange={handleChange} required />
      <Input label="Email" id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
      <Input
        label="Пароль"
        id="password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        required
      />
      {error ? <p className="form-error">{error}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Створюємо акаунт..." : "Зареєструватися"}
      </Button>
    </form>
  );
}
