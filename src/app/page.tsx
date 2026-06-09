import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BasicInfo from "@/components/BasicInfo";
import TLCardGrid from "@/components/TLCardGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <div id="bar">&nbsp;</div>
      <BasicInfo />
      <TLCardGrid />
      <Footer />
    </>
  );
}