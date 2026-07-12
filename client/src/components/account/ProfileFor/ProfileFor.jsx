import { useAuth } from "../../../hooks/useAuth/useAuth.jsx";

export default function ProfileSummary({ user }) {
  const { logout } = useAuth();

  return (
    <section className="info-card profile-card">
      <p className="section-eyebrow">Профіль</p>
      <h2>Привіт, {user?.name || "клубець"}!</h2>
      <p>Роль: {user?.role || "MEMBER"}</p>
      <p>Email: {user?.email}</p>
      <button className="button secondary" onClick={() => logout()}>
        Вийти з акаунта
      </button>
    </section>
  );
}
