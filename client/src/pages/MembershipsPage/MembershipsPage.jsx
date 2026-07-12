import PageContainer from "../../components/layout/PageContainer/PageContainer.jsx";
import Header from "../../components/layout/Header/Header.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";
import SectionTitle from "../../components/common/SectionTitle/SectionTitle.jsx";
import MembershipList from "../../components/memberships/MembershipList/MembershipList.jsx";

export default function MembershipsPage() {
  return (
    <>
      <Header />
      <PageContainer>
        <section className="section-block">
          <SectionTitle
            eyebrow="Абонементи"
            title="Оберіть план, який підходить вам найкраще"
            description="Від щоденного тренування до стабільного прогресу — у нас є формат під кожен стиль."
          />
          <MembershipList />
        </section>
      </PageContainer>
      <Footer />
    </>
  );
}
