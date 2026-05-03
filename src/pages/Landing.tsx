import Hero from '../components/sections/Hero';
import ProblemSolution from '../components/sections/ProblemSolution';
import Stats from '../components/sections/Stats';
import HowItWorks from '../components/sections/HowItWorks';
import WhyAzera from '../components/sections/WhyAzera';
import OurOffer from '../components/sections/OurOffer';
import PortfolioPreview from '../components/sections/PortfolioPreview';
import Testimonials from '../components/sections/Testimonials';
import DualCTA from '../components/sections/DualCTA';
import FAQ from '../components/sections/FAQ';

export default function Landing() {
  return (
    <>
      <Hero />
      <ProblemSolution />
      <Stats />
      <HowItWorks />
      <WhyAzera />
      <OurOffer />
      <PortfolioPreview />
      <Testimonials />
      <DualCTA />
      <FAQ />
    </>
  );
}
