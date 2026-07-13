import { useEffect, useState } from "react";
import Button from "../../common/Button/Button.jsx";
import Input from "../../common/Input/Input.jsx";
import { updateCurrentUser } from "../../../services/userApi.js";

const initialForm = {
  name: "",
  email: "",
  phone: "",
};

export default function ProfileEditor({ user, onProfileUpdated }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Будь ласка, вкажіть ім’я.");
      return;
    }

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Будь ласка, введіть коректний email.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      };

      const updated = await updateCurrentUser(payload);
      setSuccess("Профіль успішно оновлено.");
      onProfileUpdated?.(updated ?? payload);
    } catch (err) {
      setError(err.message || "Не вдалося зберегти профіль.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="profile-editor info-card" onSubmit={handleSubmit}>
      <div className="profile-editor-head">
        <div>
          <p className="section-eyebrow">Особисті дані</p>
          <h2>Редагування профілю</h2>
        </div>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}
      <div className="profile-grid">
        <Input label="Повне ім’я" id="name" name="name" value={form.name} onChange={handleChange} required />
        <Input label="Email" id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <Input label="Телефон" id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
      </div>
      <div className="button-row">
        <Button type="submit" disabled={loading}>
          {loading ? "Зберігаємо..." : "Зберегти зміни"}
        </Button>
      </div>
    </form>
  );
}
