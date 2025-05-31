export interface NavLink {
  id: string;
  title: string;
  url: string;
}

export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaUrl: string;
  secondaryCta?: string;
  secondaryCtaUrl?: string;
  backgroundImage?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface AboutContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stats: {
    title: string;
    value: string;
  }[];
  image?: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  iconName: string; // Name of the icon to use
  tags: string[];
  link: string;
}

export interface ContactContent {
  id: string;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  address: string;
  mapUrl?: string;
}

export interface FooterContent {
  id: string;
  copyright: string;
  socialLinks: {
    platform: string;
    url: string;
    icon: string;
  }[];
}

export interface SiteConfig {
  id: string;
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  favicon?: string;
  ogImage?: string;
  themeColor?: string;
  colorScheme?: string;
}

export interface UserInquiry {
  id?: string;
  name?: string;
  email?: string;
  message?: string;
  phone?: string;
  subject?: string;
  company?: string;
  projectInterest?: string;
  createdAt: Date;
  [key: string]: any; // Allow for dynamic fields
} 