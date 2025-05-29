export interface NavLink {
  id: string;
  title: string;
  href: string;
}

export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  gradient: string;
  hoverGradient: string;
}

export interface AboutContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stats: {
    id: string;
    value: string;
    label: string;
  }[];
  features: {
    id: string;
    title: string;
    description: string;
  }[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  demoLink?: string;
  githubLink?: string;
}

export interface ContactContent {
  id: string;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  address: string;
}

export interface FooterContent {
  id: string;
  companyName: string;
  description: string;
  socialLinks: {
    id: string;
    platform: string;
    url: string;
    icon: string;
  }[];
  copyright: string;
}

export interface SiteConfig {
  id: string;
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  favicon: string;
  logo: string;
} 