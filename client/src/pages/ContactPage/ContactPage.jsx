import PageContainer from "../../components/layout/PageContainer/PageContainer.jsx";
import Header from "../../components/layout/Header/Header.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";
import SectionTitle from "../../components/common/SectionTitle/SectionTitle.jsx";
import Button from "../../components/common/Button/Button.jsx";
import Input from "../../components/common/Input/Input.jsx";

export default function ContactPage() {
  return (
    <>
      <Header />
      <PageContainer>
        <section className="section-block contact-grid">
          <div>
            <SectionTitle
              eyebrow="Контакти"
              title="Зв’яжіться з нами"
              description="Ми завжди готові відповісти на ваші запитання щодо занять, абонементів і клубної програми."
            />
            <div className="info-card contact-card">
              <p>
                <strong>Адреса:</strong> вул. Шевченка 12, Київ
              </p>
              <p>
                <strong>Години:</strong> Пн–Нд, 06:00–22:00
              </p>
              <p>
                <strong>Телефон:</strong> +38 (050) 123-45-67
              </p>
              <p>
                <strong>Email:</strong> hello@limefit.club
              </p>
            </div>
          </div>
          <form className="info-card contact-form">
            <Input label="Ім'я" id="name" />
            <Input label="Email" id="email" type="email" />
            <Input label="Повідомлення" id="message" as="textarea" />
            <Button type="submit">Надіслати</Button>
          </form>
        </section>
      </PageContainer>
      <Footer />
    </>
  );
}
