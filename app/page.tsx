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
import { initializeProjectsDatabase } from "@/lib/init-db"
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
  try {
    // Initialize both the default database and our projects database
    await Promise.all([
      initDb(), // This will initialize the database with seed data if it doesn't exist
      initializeProjectsDatabase() // This will initialize our projects database
    ]);

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
    ]);

    return {
      navLinks,
      heroContent: heroContent[0],
      services,
      aboutContent: aboutContent[0],
      projects,
      contactContent: contactContent[0],
      footerContent: footerContent[0],
      siteConfig: siteConfig[0]
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return default empty data to prevent rendering errors
    return {
      navLinks: [],
      heroContent: null,
      services: [],
      aboutContent: null,
      projects: [],
      contactContent: null,
      footerContent: null,
      siteConfig: null
    };
  }
}

export default async function Home() {
  const data = await getData();
  
  // Handle missing data gracefully
  if (!data.heroContent || !data.aboutContent || !data.contactContent || !data.footerContent) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center flex-col p-4">
        <h1 className="text-2xl font-bold mb-4">Database Connection Issue</h1>
        <p className="text-center">
          There was a problem connecting to the database. Please check your MongoDB connection settings.
        </p>
        <p className="mt-4 text-sm text-gray-400">Error details have been logged to the console.</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation navLinks={data.navLinks || []} />
      <main>
        <AnimatedSection>
          <HeroSection content={data.heroContent} />
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <ServicesSection services={data.services || []} />
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
          <AboutSection content={data.aboutContent} />
        </AnimatedSection>
        <AnimatedSection delay={0.4}>
          <ProjectsSection projects={data.projects || []} />
        </AnimatedSection>
        <AnimatedSection delay={0.5}>
          <ContactSection content={data.contactContent} />
        </AnimatedSection>
      </main>
      <Footer content={data.footerContent} />
    </div>
  )
}
