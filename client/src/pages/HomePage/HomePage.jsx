import PageContainer from "../../components/layout/PageContainer/PageContainer.jsx";
import Header from "../../components/layout/Header/Header.jsx";
import Hero from "../../components/home/Hero/Hero.jsx";
import Benefits from "../../components/home/Benefits/Benefits.jsx";
import FeaturedClasses from "../../components/home/FeaturedClasses/FeaturedClasses.jsx";
import TrainersPreview from "../../components/home/TrainersPreview/TrainersPreview.jsx";
import MembershipPreview from "../../components/home/MembershipPreview/MembershipPreview.jsx";
import Testimonials from "../../components/home/Testimonials/Testimonials.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";

export default function HomePage() {
  return (
    <>
      <Header />
      <PageContainer>
        <Hero />
        <Benefits />
        <FeaturedClasses />
        <TrainersPreview />
        <MembershipPreview />
        <Testimonials />
      </PageContainer>
      <Footer />
    </>
  );
}
