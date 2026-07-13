import { useAuth } from "../../../hooks/useAuth/useAuth.jsx";
import ProfileEditor from "../ProfileEditor/ProfileEditor.jsx";

export default function ProfileSummary({ user, onProfileUpdated }) {
  const { logout } = useAuth();
  const initials = (user?.name || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="info-card profile-card">
      <div className="profile-summary-head">
        <div>
          <p className="section-eyebrow">Профіль</p>
          <h2>Привіт, {user?.name || "клубець"}!</h2>
          <p>Роль: {user?.role || "MEMBER"}</p>
          <p>Email: {user?.email}</p>
        </div>
        <button className="button secondary" onClick={() => logout()}>
          Вийти з акаунта
        </button>
      </div>
      <ProfileEditor user={user} onProfileUpdated={onProfileUpdated} />
    </section>
  );
}
