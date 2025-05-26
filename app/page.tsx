import Navigation from "@/components/Navigation"
import HeroSection from "@/components/HeroSection"
import ServicesSection from "@/components/ServicesSection"
import AboutSection from "@/components/AboutSection"
import ProjectsSection from "@/components/ProjectsSection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"
import AnimatedSection from "@/components/AnimatedSection"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <main>
        <AnimatedSection>
          <HeroSection />
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <ServicesSection />
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
          <AboutSection />
        </AnimatedSection>
        <AnimatedSection delay={0.4}>
          <ProjectsSection />
        </AnimatedSection>
        <AnimatedSection delay={0.5}>
          <ContactSection />
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  )
}
