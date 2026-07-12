import PageContainer from "../../components/layout/PageContainer/PageContainer.jsx";
import Header from "../../components/layout/Header/Header.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";
import SectionTitle from "../../components/common/SectionTitle/SectionTitle.jsx";
import ClassList from "../../components/classes/ClassList/ClassList.jsx";

export default function ClassesPage() {
  return (
    <>
      <Header />
      <PageContainer>
        <section className="section-block">
          <SectionTitle
            eyebrow="Розклад"
            title="Заняття для кожного рівня"
            description="Обирайте тренування, які підходять саме вам, і бронюйте місце за лічені хвилини."
          />
          <ClassList />
        </section>
      </PageContainer>
      <Footer />
    </>
  );
}
