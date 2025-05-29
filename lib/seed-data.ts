import { v4 as uuidv4 } from "uuid";
import {
  NavLink,
  HeroContent,
  Service,
  AboutContent,
  Project,
  ContactContent,
  FooterContent,
  SiteConfig,
} from "./types";

export const navLinks: NavLink[] = [
  {
    id: uuidv4(),
    title: "Home",
    href: "#home",
  },
  {
    id: uuidv4(),
    title: "Services",
    href: "#services",
  },
  {
    id: uuidv4(),
    title: "About",
    href: "#about",
  },
  {
    id: uuidv4(),
    title: "Projects",
    href: "#projects",
  },
  {
    id: uuidv4(),
    title: "Contact",
    href: "#contact",
  },
];

export const heroContent: HeroContent = {
  id: uuidv4(),
  title: "Innovative Software Solutions",
  subtitle: "Building the future with code and creativity",
  buttonText: "Get Started",
  buttonLink: "#services",
};

export const services: Service[] = [
  {
    id: uuidv4(),
    icon: "Brain",
    title: "AI/ML Solutions",
    description: "Advanced machine learning models and AI systems that deliver intelligent insights for your business.",
    gradient: "from-blue-600 to-purple-600",
    hoverGradient: "from-blue-700 to-purple-700",
  },
  {
    id: uuidv4(),
    icon: "Code",
    title: "Software Development",
    description: "Custom software solutions built with modern technologies and scalable architecture for optimal performance.",
    gradient: "from-purple-600 to-pink-600",
    hoverGradient: "from-purple-700 to-pink-700",
  },
  {
    id: uuidv4(),
    icon: "Cog",
    title: "Smart Systems & Automation",
    description: "Intelligent automation systems that streamline processes and increase operational efficiency.",
    gradient: "from-pink-600 to-red-600",
    hoverGradient: "from-pink-700 to-red-700",
  },
  {
    id: uuidv4(),
    icon: "Database",
    title: "Data-Driven Applications",
    description: "Powerful applications that leverage data analytics to drive informed decision-making.",
    gradient: "from-red-600 to-orange-600",
    hoverGradient: "from-red-700 to-orange-700",
  },
];

export const aboutContent: AboutContent = {
  id: uuidv4(),
  title: "About Us",
  subtitle: "Driving innovation through technology",
  description: "We are a team of passionate developers, designers, and technologists dedicated to creating exceptional digital experiences. With expertise across various domains, we tackle complex challenges and deliver solutions that exceed expectations.",
  stats: [
    {
      id: uuidv4(),
      value: "50+",
      label: "Projects Completed",
    },
    {
      id: uuidv4(),
      value: "10+",
      label: "Years Experience",
    },
    {
      id: uuidv4(),
      value: "30+",
      label: "Happy Clients",
    },
    {
      id: uuidv4(),
      value: "99%",
      label: "Client Satisfaction",
    },
  ],
  features: [
    {
      id: uuidv4(),
      title: "Modern Tech Stack",
      description: "We use the latest technologies and frameworks to build robust and scalable applications.",
    },
    {
      id: uuidv4(),
      title: "User-Centric Design",
      description: "Our solutions are designed with the end-user in mind, ensuring intuitive and engaging experiences.",
    },
    {
      id: uuidv4(),
      title: "Agile Methodology",
      description: "We follow agile practices to deliver value quickly and adapt to changing requirements.",
    },
    {
      id: uuidv4(),
      title: "Continuous Support",
      description: "Our commitment doesn't end at deployment; we provide ongoing support and maintenance.",
    },
  ],
};

export const projects: Project[] = [
  {
    id: uuidv4(),
    title: "AI-Powered Analytics Platform",
    description: "A comprehensive analytics platform leveraging machine learning to provide actionable insights from complex data sets.",
    imageUrl: "/images/project1.jpg",
    tags: ["AI", "Machine Learning", "Data Analytics"],
    demoLink: "https://example.com",
    githubLink: "https://github.com/example",
  },
  {
    id: uuidv4(),
    title: "E-Commerce Mobile App",
    description: "A feature-rich mobile application for a leading e-commerce brand, enhancing user experience and driving sales.",
    imageUrl: "/images/project2.jpg",
    tags: ["React Native", "Redux", "Node.js"],
    demoLink: "https://example.com",
    githubLink: "https://github.com/example",
  },
  {
    id: uuidv4(),
    title: "Smart Home Automation System",
    description: "An IoT-based system for comprehensive home automation, offering seamless control over various smart devices.",
    imageUrl: "/images/project3.jpg",
    tags: ["IoT", "Embedded Systems", "Cloud"],
    demoLink: "https://example.com",
    githubLink: "https://github.com/example",
  },
  {
    id: uuidv4(),
    title: "Enterprise Resource Planning Solution",
    description: "A scalable ERP solution tailored for medium to large businesses, streamlining operations and improving efficiency.",
    imageUrl: "/images/project4.jpg",
    tags: ["SaaS", "Cloud Architecture", "Enterprise"],
    demoLink: "https://example.com",
    githubLink: "https://github.com/example",
  },
];

export const contactContent: ContactContent = {
  id: uuidv4(),
  title: "Get in Touch",
  subtitle: "We'd love to hear from you",
  email: "hello@devnex.com",
  phone: "+1 (555) 123-4567",
  address: "123 Tech Park, Silicon Valley, CA 94025",
};

export const footerContent: FooterContent = {
  id: uuidv4(),
  companyName: "Devnex",
  description: "Building innovative software solutions for the modern world.",
  socialLinks: [
    {
      id: uuidv4(),
      platform: "Twitter",
      url: "https://twitter.com",
      icon: "Twitter",
    },
    {
      id: uuidv4(),
      platform: "GitHub",
      url: "https://github.com",
      icon: "Github",
    },
    {
      id: uuidv4(),
      platform: "LinkedIn",
      url: "https://linkedin.com",
      icon: "Linkedin",
    },
  ],
  copyright: "© 2023 Devnex. All rights reserved.",
};

export const siteConfig: SiteConfig = {
  id: uuidv4(),
  siteName: "Devnex",
  siteDescription: "Professional software development services",
  siteUrl: "https://devnex.com",
  favicon: "/favicon.ico",
  logo: "/logo.svg",
}; 