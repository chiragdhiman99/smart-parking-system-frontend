import Hero from '../components/landing/Hero'
import Stats from '../components/landing/Stats'
import HowItWorks from '../components/landing/HowItWorks'
import Locations from '../components/landing/Locations'
import Features from '../components/landing/Features'
import Testimonials from '../components/landing/Testimonials'
import OwnerSection from '../components/landing/OwnerSection'
import CTABanner from '../components/landing/CTABanner'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const Landing = () => {
  
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <Locations />
      <Features />
      <Testimonials />
      <OwnerSection />
      <CTABanner />
      <Footer />
    </div>
  )
}

export default Landing