import Hero from '../components/sections/Hero';
import ProblemSolution from '../components/sections/ProblemSolution';
import Stats from '../components/sections/Stats';
import HowItWorks from '../components/sections/HowItWorks';
import WhyAzera from '../components/sections/WhyAzera';
import PortfolioPreview from '../components/sections/PortfolioPreview';
import Testimonials from '../components/sections/Testimonials';
import BrandCTA from '../components/sections/BrandCTA';
import CreatorCTA from '../components/sections/CreatorCTA';
import FAQ from '../components/sections/FAQ';

export default function Landing() {
  return (
    <>
      <Hero />
      <WhyAzera />
      <Stats />
      <HowItWorks />
      <ProblemSolution />
      <PortfolioPreview />
      <Testimonials />
      <BrandCTA />
      <CreatorCTA />
      <FAQ />
    </>
  );
}
