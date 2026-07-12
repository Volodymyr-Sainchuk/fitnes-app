import PageContainer from "../../components/layout/PageContainer/PageContainer.jsx";
import Header from "../../components/layout/Header/Header.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";
import RegisterForm from "../../components/account/RegisterForm/RegisterForm.jsx";

export default function RegisterPage() {
  return (
    <>
      <Header />
      <PageContainer>
        <section className="auth-page">
          <div className="auth-card">
            <p className="section-eyebrow">Реєстрація</p>
            <h1>Створіть свій акаунт LimeFit</h1>
            <p>Дізнайтеся про заняття, бронюйте місця й відстежуйте прогрес.</p>
            <RegisterForm />
          </div>
        </section>
      </PageContainer>
      <Footer />
    </>
  );
}
