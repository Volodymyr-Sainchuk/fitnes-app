import PageContainer from "../../components/layout/PageContainer/PageContainer.jsx";
import Header from "../../components/layout/Header/Header.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";
import LoginForm from "../../components/account/LoginForm/LoginForm.jsx";

export default function LoginPage() {
  return (
    <>
      <Header />
      <PageContainer>
        <section className="auth-page">
          <div className="auth-card">
            <p className="section-eyebrow">Вхід</p>
            <h1>Увійдіть у свій кабінет</h1>
            <p>Поверніться до тренувань, бронювань і персонального прогресу.</p>
            <LoginForm />
          </div>
        </section>
      </PageContainer>
      <Footer />
    </>
  );
}
