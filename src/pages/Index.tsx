
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { Routes, Route } from "react-router-dom";
import FeaturesPage from "./Features";

const Index = () => {
  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen">
          <Hero />
          <HowItWorks />
          <Features />
          <Reviews />
          <FAQ />
          <Footer />
        </div>
      } />
      <Route path="/features" element={<FeaturesPage />} />
    </Routes>
  );
};

export default Index;
