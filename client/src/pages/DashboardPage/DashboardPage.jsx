import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer/PageContainer.jsx";
import Header from "../../components/layout/Header/Header.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";
import ProfileSummary from "../../components/account/ProfileFor/ProfileFor.jsx";
import MyBookings from "../../components/account/MyBookings/MyBookings.jsx";
import Loader from "../../components/common/Loader/Loader.jsx";
import { fetchCurrentUser } from "../../services/userApi.js";
import { useAuth } from "../../hooks/useAuth/useAuth.jsx";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
      return;
    }

    let active = true;
    fetchCurrentUser()
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, navigate, user]);

  if (authLoading || loading) return <Loader label="Підготовлюємо кабінет..." />;
  if (error) return <p className="form-error">{error}</p>;

  return (
    <>
      <Header />
      <PageContainer>
        <section className="section-block dashboard-grid">
          <ProfileSummary user={profile || user} />
          <div className="info-card">
            <p className="section-eyebrow">Мої бронювання</p>
            <h2>Список активних записів</h2>
            <MyBookings />
          </div>
        </section>
      </PageContainer>
      <Footer />
    </>
  );
}
