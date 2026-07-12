import PageContainer from "../../components/layout/PageContainer/PageContainer.jsx";
import Header from "../../components/layout/Header/Header.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";
import SectionTitle from "../../components/common/SectionTitle/SectionTitle.jsx";
import TrainerList from "../../components/trainers/TrainerList/TrainerList.jsx";

export default function TrainersPage() {
  return (
    <>
      <Header />
      <PageContainer>
        <section className="section-block">
          <SectionTitle
            eyebrow="Тренери"
            title="Команда, яка допомагає вам рости"
            description="Кожен тренер — це досвід, підхід і підтримка на шляху до результату."
          />
          <TrainerList />
        </section>
      </PageContainer>
      <Footer />
    </>
  );
}
