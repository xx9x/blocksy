import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import {
  ExploreSection,
  FeaturesSection,
  FinalCTA,
  Footer,
  HowItWorks,
  WhyBlocksy,
  YourCreation,
} from "@/components/landing/Sections";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <ExploreSection />
        <WhyBlocksy />
        <YourCreation />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
