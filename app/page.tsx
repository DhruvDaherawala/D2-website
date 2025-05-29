import Navigation from "@/components/Navigation"
import HeroSection from "@/components/HeroSection"
import ServicesSection from "@/components/ServicesSection"
import AboutSection from "@/components/AboutSection"
import ProjectsSection from "@/components/ProjectsSection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"
import AnimatedSection from "@/components/AnimatedSection"
import { getAll } from "@/lib/db"
import { initDb } from "@/lib/init-db"
import { 
  NavLink,
  HeroContent,
  Service,
  AboutContent,
  Project,
  ContactContent,
  FooterContent,
  SiteConfig
} from "@/lib/types"

// Initialize the database on first load if needed
export const revalidate = 3600 // Revalidate every hour

async function getData() {
  await initDb() // This will initialize the database with seed data if it doesn't exist

  const [
    navLinks,
    heroContent,
    services,
    aboutContent,
    projects,
    contactContent,
    footerContent,
    siteConfig
  ] = await Promise.all([
    getAll<NavLink>("navigation"),
    getAll<HeroContent>("hero"),
    getAll<Service>("services"),
    getAll<AboutContent>("about"),
    getAll<Project>("projects"),
    getAll<ContactContent>("contact"),
    getAll<FooterContent>("footer"),
    getAll<SiteConfig>("site-config")
  ])

  return {
    navLinks,
    heroContent: heroContent[0],
    services,
    aboutContent: aboutContent[0],
    projects,
    contactContent: contactContent[0],
    footerContent: footerContent[0],
    siteConfig: siteConfig[0]
  }
}

export default async function Home() {
  const data = await getData()
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation navLinks={data.navLinks} />
      <main>
        <AnimatedSection>
          <HeroSection content={data.heroContent} />
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <ServicesSection services={data.services} />
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
          <AboutSection content={data.aboutContent} />
        </AnimatedSection>
        <AnimatedSection delay={0.4}>
          <ProjectsSection projects={data.projects} />
        </AnimatedSection>
        <AnimatedSection delay={0.5}>
          <ContactSection content={data.contactContent} />
        </AnimatedSection>
      </main>
      <Footer content={data.footerContent} />
    </div>
  )
}
